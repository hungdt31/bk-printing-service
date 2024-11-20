import express from "express";
import { BaseController } from "./abstractions/base-controller";
import { StatusCodes } from "http-status-codes";
import expressAsyncHandler from "express-async-handler";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import * as fs from "fs";
import { MulterError } from "multer";
import { prisma } from "../providers/prisma.client";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import xlsx from "xlsx";

interface SystemConfig {
  PERMITTED_FILE_TYPES: string[];
  MAX_FILE_SIZE: number;
  // ... other config fields
}

export default class DocumentsController extends BaseController {
  public path = "/documents";
  private supabase;
  private systemConfig: SystemConfig;
  public multerConfig;

  constructor() {
    super();
    this.systemConfig = this.loadSystemConfig();
    this.multerConfig = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: this.getSystemConfig().MAX_FILE_SIZE, // Sử dụng MAX_FILE_SIZE từ config
      },
    }).single("file");
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (!url || !key) {
      throw new Error("Missing Supabase credentials");
    }

    this.supabase = createClient(url, key);
    this.initializeRoutes();
    this.ensureBucketExists();
  }

  private loadSystemConfig(): SystemConfig {
    try {
      const configPath = "configuration-system.json";
      const configFile = fs.readFileSync(configPath, "utf8");
      return JSON.parse(configFile);
    } catch (error) {
      console.error("Error loading system config:", error);
      throw new Error("Failed to load system configuration");
    }
  }

  private getSystemConfig(): SystemConfig {
    return this.systemConfig;
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const documentsBucket = buckets?.find(
        (bucket) => bucket.name === "documents",
      );
      if (!documentsBucket) {
        const { data, error } = await this.supabase.storage.createBucket(
          "documents",
          {
            public: true,
            fileSizeLimit: this.getSystemConfig().MAX_FILE_SIZE,
            allowedMimeTypes: this.getSystemConfig().PERMITTED_FILE_TYPES,
          },
        );
        if (error) {
          console.error("Error creating bucket:", error.message);
        } else {
          console.log('Bucket "documents" created successfully');
        }
      } else {
        console.log('Bucket "documents" already exists');
      }
    } catch (error) {
      console.error("Error checking/creating bucket:", error);
    }
  }

  private normalizeFileName(fileName: string): string {
    return fileName
      .normalize("NFD") // Chuẩn hóa Unicode
      .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D") // Xử lý chữ đ
      .replace(/[^a-zA-Z0-9.-]/g, "-") // Thay thế ký tự đặc biệt bằng dấu gạch ngang
      .replace(/-+/g, "-") // Gộp nhiều dấu gạch ngang liên tiếp
      .replace(/^-+|-+$/g, ""); // Xóa dấu gạch ngang ở đầu và cuối
  }

  public initializeRoutes(): void {
    this.router.post(
      `${this.path}/upload`,
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        this.multerConfig(req, res, (error: any) => {
          if (error instanceof MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
              res.status(StatusCodes.BAD_REQUEST).json({
                message: `File size exceeds limit of ${
                  this.getSystemConfig().MAX_FILE_SIZE / (1024 * 1024)
                }MB`,
                error: "LIMIT_FILE_SIZE",
              });
              return;
            }
            res.status(StatusCodes.BAD_REQUEST).json({
              message: "File upload error",
              error: error.code,
            });
            return;
          } else if (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: "Unknown error during file upload",
              error: error.message,
            });
            return;
          }
          next();
        });
      },
      this.upload,
    );

    this.router.delete(`${this.path}/delete/:fileName`, this.deleteFile);
  }

  private async getPageCount(
    buffer: Buffer,
    mimeType: string,
  ): Promise<number> {
    try {
      switch (mimeType) {
        case "application/pdf":
          const pdfData = await pdfParse(buffer);
          return pdfData.numpages;

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          // Đối với DOCX, chúng ta đếm số section breaks
          const result = await mammoth.extractRawText({ buffer });
          const text = result.value;
          // Đếm số section breaks + 1
          return (text.match(/\f/g) || []).length + 1;

        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          // Đối với Excel, đếm số worksheets
          const workbook = xlsx.read(buffer);
          return workbook.SheetNames.length;

        default:
          return 0;
      }
    } catch (error) {
      console.error("Error getting page count:", error);
      return 0;
    }
  }

  upload = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<void> => {
      try {
        if (!req.file) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: "No file uploaded",
          });
          return;
        }

        // Validate file type using config
        if (
          !this.getSystemConfig().PERMITTED_FILE_TYPES.includes(
            req.file.mimetype,
          )
        ) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: `Invalid file type. Allowed types: ${this.getSystemConfig().PERMITTED_FILE_TYPES.join(
              ", ",
            )}`,
          });
          return;
        }

        // Validate file size
        if (req.file.size > this.getSystemConfig().MAX_FILE_SIZE) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: `File size exceeds limit of ${
              this.getSystemConfig().MAX_FILE_SIZE / (1024 * 1024)
            }MB`,
          });
          return;
        }

        // Create unique filename
        const timestamp = Date.now();
        const normalizedOriginalName = this.normalizeFileName(
          req.file.originalname,
        );
        const fileName = `${timestamp}-${normalizedOriginalName}`;

        // Get page count
        const pageCount = await this.getPageCount(
          req.file.buffer,
          req.file.mimetype,
        );

        // Upload to Supabase
        const { data, error } = await this.supabase.storage
          .from("documents")
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Upload failed",
            error: error.message,
          });
          return;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = this.supabase.storage.from("documents").getPublicUrl(fileName);

        // Save to database with page count
        try {
          const document = await prisma.document.create({
            data: {
              path: data.path,
              filename: req.file.originalname,
              size: req.file.size,
              mimetype: req.file.mimetype,
              url: publicUrl,
              user_id: req.jwtDecoded?.id as number,
              page_count: pageCount.toString(), // Thêm số trang vào database
            },
          });

          res.status(StatusCodes.OK).json({
            message: "Upload successfully",
            data: document,
          });
        } catch (dbError) {
          // ... existing error handling ...
          if (dbError instanceof Error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: "An unexpected error occurred",
              error: dbError.message,
            });
        }
      } catch (error: any) {
        console.error("Unexpected error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    },
  );

  deleteFile = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<void> => {
      try {
        const { fileName } = req.params;

        if (!fileName) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: "File name is required",
          });
          return;
        }

        // Kiểm tra file có tồn tại không
        const { data: existingFile } = await this.supabase.storage
          .from("documents")
          .list("", {
            search: fileName,
          });

        if (!existingFile || existingFile.length === 0) {
          res.status(StatusCodes.NOT_FOUND).json({
            message: "File not found",
          });
          return;
        }

        // Xóa file
        const { error } = await this.supabase.storage
          .from("documents")
          .remove([fileName]);

        if (error) {
          console.error("Delete error:", error);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Delete failed",
            error: error.message,
          });
          return;
        }
        await prisma.document.delete({
          where: {
            path: fileName,
          },
        });
        res.status(StatusCodes.OK).json({
          message: "File deleted successfully",
          data: {
            fileName: fileName,
          },
        });
      } catch (error: any) {
        console.error("Unexpected error during file deletion:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    },
  );
}
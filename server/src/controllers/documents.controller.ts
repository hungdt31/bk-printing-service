import express from "express";
import { BaseController } from "./abstractions/base-controller";
import { StatusCodes } from "http-status-codes";
import expressAsyncHandler from "express-async-handler";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import { prisma } from "../providers/prisma.client";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import xlsx from "xlsx";
import { MulterConfig } from "../config/multer.config";
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { JwtPayload } from "../types/jwt-payload";
import RequestValidator from "../middlewares/request-validator";
import { validateResourceId } from "../middlewares/id.middleware";
import { updateDocumentSchema } from "../schemas/document.schema";
import { systemProvider } from "../providers/system.provider";
import { ROLE } from "../utils/constant";
import createHttpError from "http-errors";

interface SystemConfig {
  PERMITTED_FILE_TYPES: string[];
  MAX_FILE_SIZE: number;
  // ... other config fields
}

interface MulterRequest extends Request<
  ParamsDictionary,
  any,
  any,
  ParsedQs,
  Record<string, any>
> {
  file: Express.Multer.File;
  jwtDecoded: JwtPayload;
}

export default class DocumentsController extends BaseController {
  public path = "/documents";
  private supabase;
  private multerHandler: MulterConfig;

  constructor() {
    super();
    // Sử dụng system provider
    const config = systemProvider.getConfig();
    
    this.multerHandler = new MulterConfig({
      maxFileSize: config.MAX_FILE_SIZE,
      permittedFileTypes: config.PERMITTED_FILE_TYPES
    });

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (!url || !key) {
      throw new Error("Missing Supabase credentials");
    }

    this.supabase = createClient(url, key);
    this.initializeRoutes();
    this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const documentsBucket = buckets?.find(
        (bucket) => bucket.name === "documents"
      );

      if (!documentsBucket) {
        const config = systemProvider.getConfig();
        const { data, error } = await this.supabase.storage.createBucket(
          "documents",
          {
            public: true,
            fileSizeLimit: config.MAX_FILE_SIZE,
            allowedMimeTypes: config.PERMITTED_FILE_TYPES,
          }
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
      this.multerHandler.handleUpload,
      this.uploadFile,
    );

    this.router.delete(`${this.path}/:fileName`, this.deleteFile);

    this.router.delete(`${this.path}`, this.deleteFilesByListId);

    this.router.get(`${this.path}/me`, this.listFiles);

    this.router.get(`${this.path}/:id`, this.getDocumentById);

    this.router.patch(`${this.path}/:id`,[
      validateResourceId,
      new RequestValidator(updateDocumentSchema).validate(),
    ], this.updateFile);
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

  getDocumentById = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<void> => {
      const { id } = req.params;
      const document = await prisma.document.findUnique({
        where: {
          document_id: parseInt(id),
        },
      });
      if (!document) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "Document not found",
        });
      }
      res.status(StatusCodes.OK).json({
        message: "Get document successfully",
        data: document,
      });
    }
  )

  uploadFile = expressAsyncHandler(
    async (
      req: express.Request, 
      res: express.Response
    ): Promise<void> => {
      // Type assertion để TypeScript biết chắc chắn về req.file
      // Kiểm tra authentication
      const file = (req as MulterRequest).file;
      
      const timestamp = Date.now();
      const normalizedOriginalName = this.normalizeFileName(file.originalname);
      let fileName = `${timestamp}-${normalizedOriginalName}`;

      // Get page count
      const pageCount = await this.getPageCount(
        file.buffer,
        file.mimetype,
      );

      // Upload to Supabase
      const { data, error } = await this.supabase.storage
        .from("documents")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
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

      // check if file name is exist
      const existingDocument = await prisma.document.findFirst({
        where: {
          filename: file.originalname,
        },
      });
      if (existingDocument) {
        file.originalname = `${file.originalname}-${existingDocument.document_id + 1}`;
      }
      // Save to database with page count
      const document = await prisma.document.create({
        data: {
          path: data.path,
          filename: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          url: publicUrl,
          user_id: req.jwtDecoded?.id as number,
          page_count: pageCount.toString(), // Thêm số trang vào database
        },
      });

      res.status(StatusCodes.OK).json({
        message: "Upload successfully",
        data: document,
      });
    },
  );

  // delete file if it's yours or SPSO
  deleteFile = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<void> => {
      const { fileName } = req.params;

      if (!fileName) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "File name is required",
        });
        return;
      }

      // Lấy thông tin document từ database trước
      const document = await prisma.document.findUnique({
        where: {
          path: fileName,
        },
      });

      if (!document) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "Document not found",
        });
        return;
      }

      // Kiểm tra quyền xóa
      const userId = req.jwtDecoded?.id as number;
      const userRole = req.jwtDecoded?.role as string;

      if (document.user_id !== userId && userRole !== ROLE.spso) {
        res.status(StatusCodes.FORBIDDEN).json({
          message: "This document is not yours",
        });
        return;
      }

      // Kiểm tra file có tồn tại trong storage không
      const { data: existingFile } = await this.supabase.storage
        .from("documents")
        .list("", {
          search: fileName,
        });

      if (!existingFile || existingFile.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "File not found in storage",
        });
        return;
      }

      // Xóa file từ storage
      const { error } = await this.supabase.storage
        .from("documents")
        .remove([fileName]);

      if (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Delete failed",
          error: error.message,
        });
        return;
      }

      // Xóa record từ database
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
    }
  );

  deleteFilesByListId = expressAsyncHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const { ids } = req.body;
      const userId = req.jwtDecoded?.id as number;
      const userRole = req.jwtDecoded?.role as string;

      // Validate input
      if (!Array.isArray(ids) || ids.length === 0) {
        return next(
          createHttpError(StatusCodes.BAD_REQUEST, "You must send a valid list of IDs to delete!")
        );
      }

      // Get documents from database
      const documents = await prisma.document.findMany({
        where: {
          document_id: { in: ids }
        }
      });

      // Check if all documents exist
      if (documents.length !== ids.length) {
        return next(
          createHttpError(StatusCodes.NOT_FOUND, "Some documents were not found")
        );
      }

      // Check permissions
      const hasPermission = documents.every(doc => 
        doc.user_id === userId || userRole === ROLE.spso
      );
      
      if (!hasPermission) {
        return next(
          createHttpError(StatusCodes.FORBIDDEN, "You don't have permission to delete some of these documents")
        );
      }

      // Delete files from storage
      const filesToDelete = documents.map(doc => doc.path);
      const { error: storageError } = await this.supabase.storage
        .from("documents")
        .remove(filesToDelete);

      if (storageError) {
        return next(
          createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete files from storage")
        );
      }

      // Delete from database
      await prisma.document.deleteMany({
        where: {
          document_id: { in: ids }
        }
      });

      res.status(StatusCodes.OK).json({
        message: "Files deleted successfully",
        data: ids,
      });
    }
  );

  // list files if it's yours
  listFiles = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<void> => {
      const user = await prisma.user.findUnique({
        where: {
          user_id: req.jwtDecoded?.id as number,
        },
        include: {
          documents: {
            select: {
              document_id: true,
              filename: true,
              mimetype: true,
              size: true,
              url: true,
              path: true,
              created_at: true,
              updated_at: true,
            },
          },
        }
      });
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "User not found",
        });
      }
      res.status(StatusCodes.OK).json({
        message: "List files successfully",
        data: user?.documents,
      });
    }
  );

  // update file if it's yours
  updateFile = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<void> => {
      const { id } = req.params;
      const { filename } = req.body;
      const userId = req.jwtDecoded?.id as number;
      const existingDocument = await prisma.document.findUnique({
        where: {
          document_id: parseInt(id),
        },
      });
      if (!existingDocument) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "Document not found",
        });
        return;
      }
      if (existingDocument.user_id !== userId) {
        res.status(StatusCodes.FORBIDDEN).json({
          message: `This document is not yours`,
        });
        return;
      }
      if (filename) {
        await prisma.document.update({
          where: {
            document_id: parseInt(id),
          },
          data: {
            filename: filename,
          },
        });
      }
      res.status(StatusCodes.OK).json({
        message: "Update successfully",
      });
    }
  );
}

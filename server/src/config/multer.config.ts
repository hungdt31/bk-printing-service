import multer, { MulterError } from "multer";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "../types/jwt-payload";

// Mở rộng interface Request để bao gồm cả file và jwtDecoded
interface RequestWithJwt extends Request {
  jwtDecoded?: JwtPayload;
  file?: Express.Multer.File;
}

export class MulterConfig {
  private config: {
    maxFileSize: number;
    permittedFileTypes: string[];
  };
  private upload: multer.Multer;

  constructor(config: { maxFileSize: number; permittedFileTypes: string[] }) {
    this.config = config;

    // Khởi tạo multer với các options
    const multerOptions: multer.Options = {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: this.config.maxFileSize,
      },
      fileFilter: (req, file, cb) => {
        // Kiểm tra file type
        if (!this.config.permittedFileTypes.includes(file.mimetype)) {
          return cb(
            new Error(
              `Invalid file type. Allowed types: ${this.config.permittedFileTypes.join(
                ", ",
              )}`,
            ),
          );
        }
        cb(null, true);
      },
    };

    this.upload = multer(multerOptions);
  }

  public handleUpload = (
    req: RequestWithJwt,
    res: Response,
    next: NextFunction,
  ) => {
    // Xử lý upload file
    this.upload.single("file")(req as Request, res, (error: any) => {
      if (error instanceof MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: `File size exceeds limit of ${
              this.config.maxFileSize / (1024 * 1024)
            }MB`,
            error: "LIMIT_FILE_SIZE",
          });
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "File upload error",
          error: error.code,
        });
      } else if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: error.message || "Unknown error during file upload",
          error: error.message,
        });
      }

      if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "No file uploaded",
        });
      }

      next();
    });
  };
}

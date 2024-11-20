import { z } from "zod";

// Định nghĩa các MIME types được chấp nhận
const MimeTypes = z.enum([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

// Schema cho một file type entry
const FileTypeEntry = z.object({
  mimeType: MimeTypes,
  extensions: z.union([z.string(), z.array(z.string())]),
  maxSize: z.number().int().positive().optional(), // Kích thước tối đa cho từng loại file (optional)
});

export const UpdateSettingsSchema = z.object({
  DEFAULT_BALANCE: z
    .number()
    .int()
    .positive({
      message: "Default balance must be a positive number",
    })
    .optional(),
  DATE_TO_UPDATE: z
    .string()
    .regex(/^[\d\s*/,-]*$/, {
      message: "Invalid cron expression format",
    })
    .optional(),
  PERMITTED_FILE_TYPES: z.record(MimeTypes, FileTypeEntry).optional(),
  MAX_FILE_SIZE: z
    .number()
    .int()
    .positive({
      message: "Max file size must be a positive number",
    })
    .optional(),
});

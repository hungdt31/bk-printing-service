import { z } from 'zod';

// Schema cho việc tạo document mới
export const documentSchema = z.object({
  filename: z.string().max(256, 'Filename must not exceed 256 characters'),
});

// Schema cho việc cập nhật document
export const updateDocumentSchema = documentSchema.partial()

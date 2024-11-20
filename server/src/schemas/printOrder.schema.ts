import { z } from 'zod';

export const PrintOrderSchema = z.object({
  side: z.enum(['ONE', 'TWO']), // Enum cho chế độ in một mặt/hai mặt
  page_size: z.enum(['A4', 'A3', 'Letter']), // Enum kích thước trang
  orientation: z.enum(['PORTRAIT', 'LANDSCAPE']), // Enum hướng in
  pages_per_sheet: z.number().int().default(1), // Số trang trên một tờ
  scale: z.number().default(1.0), // Tỉ lệ thu phóng
  time_start: z.date().default(() => new Date()), // Thời điểm bắt đầu in
  time_end: z.date().nullable(), // Thời điểm hoàn thành in (có thể null)
  status: z.enum(['PENDING', 'PROGRESS', 'COMPLETED', 'CANCELLED']), // Enum trạng thái lệnh in
  pages_to_be_printed: z.string().max(64).nullable(), // Ví dụ: "1-3, 5, 7-9" (có thể null)
  num_pages_printed: z.number().int().nullable(), // Số trang đã in thực tế (có thể null)
  user_id: z.number().int(), // Liên kết với User
});

export const UpdatePrintOrderSchema = PrintOrderSchema.partial();

import { z } from 'zod';

export const PrintOrderSchema = z.object({
  side: z.enum(['ONE', 'TWO']), // Enum cho chế độ in một mặt/hai mặt
  page_size: z.enum(['A4', 'A3']), // Enum kích thước trang
  orientation: z.enum(['PORTRAIT', 'LANDSCAPE']), // Enum hướng in
  pages_per_sheet: z.coerce.number().int().default(1), // Số trang trên một tờ
  scale: z.coerce.number().default(1.0), // Tỉ lệ thu phóng
  time_end: z.date().optional(), // Thời điểm hoàn thành in (có thể null)
  // Array of page numbers to print
  pages_to_be_printed: z.array(
    z.number().int().positive('Page numbers must be positive')
  ),
  status: z.enum(['PENDING', 'PROGRESS', 'SUCCESS', 'FAILED']).default('PENDING'), // Trạng thái đơn hàng
  printer_id: z.coerce.number().int(),
  document_id: z.coerce.number().int(),
});
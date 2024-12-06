import { z } from "zod";

export const PrintOrderSchema = z.object({
  side: z.enum(["ONE", "TWO"]), // Enum cho chế độ in một mặt/hai mặt
  page_size: z.enum(["A4", "A3"]), // Enum kích thước trang
  orientation: z.enum(["PORTRAIT", "LANDSCAPE"]), // Enum hướng in
  pages_per_sheet: z.number().int().default(1), // Số trang trên một tờ
  scale: z.number().default(1.0), // Tỉ lệ thu phóng
  time_end: z.date().optional(), // Thời điểm hoàn thành in (có thể null)
  // Array of page numbers to print
  pages_to_be_printed: z.array(
    z.number().int().positive("Page numbers must be positive"),
  ),
  status: z
    .enum(["PENDING", "PROGRESS", "SUCCESS", "FAILED"])
    .default("PENDING"), // Trạng thái đơn hàng
  printer_id: z.number().int(),
  document_id: z.number().int(),
});

export const searchPrintOrder = z
  .object({
    time_start: z.coerce.date().optional(),
    time_end: z.coerce.date().optional(),
    name: z.string().optional(),
    status: z.enum(["PENDING", "PROGRESS", "SUCCESS", "FAILED"]).optional(),
    printer_id: z.number().int().optional(),
  })
  .refine(
    (data) => {
      if (data.time_start && data.time_end) {
        return data.time_start < data.time_end;
      }
      return true;
    },
    {
      message: "time_start must be less than time_end",
      path: ["time_start", "time_end"],
    },
  );

export const UpdatePrintOrderSchema = PrintOrderSchema.partial();

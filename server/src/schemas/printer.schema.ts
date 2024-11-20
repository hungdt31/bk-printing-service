import { z } from "zod";

// Enum cho Campus
const CampusEnum = z.enum(["ONE", "TWO", "THREE"]); // Thêm các giá trị cụ thể nếu cần

// Enum cho PrinterStatus
const PrinterStatusEnum = z.enum(["RUNNING", "DISABLED", "MAINTENANCE"]); // Thêm trạng thái phù hợp

// Zod schema cho Printer
const PrinterSchema = z.object({
  // Tên máy in (chuỗi, bắt buộc, tối đa 256 ký tự, phải là duy nhất)
  name: z.string().max(256).min(4),

  // Thương hiệu máy in (chuỗi, bắt buộc, tối đa 256 ký tự)
  brand: z.string().max(256).min(1),

  // Model máy in (chuỗi, bắt buộc, tối đa 256 ký tự)
  model: z.string().max(256).min(4),

  // Mô tả chi tiết máy in (chuỗi, tùy chọn, tối đa 4096 ký tự)
  description: z.string().max(4096).optional(),

  // Khuôn viên máy in được đặt (enum, giá trị mặc định là "ONE")
  loc_campus: CampusEnum.default("ONE"),

  // Tòa nhà trong khuôn viên (chuỗi, bắt buộc, tối đa 64 ký tự)
  loc_building: z.string().max(64),

  // Số phòng (chuỗi, bắt buộc, tối đa 64 ký tự)
  loc_room: z.string().max(64),

  // Trạng thái máy in (enum, giá trị mặc định là "RUNNING")
  status: PrinterStatusEnum.default("RUNNING"),
});

const UpdatePrinterSchema = PrinterSchema.partial();
// Xuất schema
export { PrinterSchema, UpdatePrinterSchema, CampusEnum, PrinterStatusEnum };

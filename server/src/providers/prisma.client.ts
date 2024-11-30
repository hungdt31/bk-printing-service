import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export const prisma = new PrismaClient()
// .$extends({
//   query: {
//     printOrder: {
//       async create({ args, query }) {
//         // Thực hiện hành động gốc của Prisma (create PrintOrder)
//         const result = await query(args);

//         // Trích xuất thông tin năm và tháng từ PrintOrder vừa tạo
//         const year = result.time_start.getFullYear();
//         const month = result.time_start.getMonth() + 1;

//         // Cập nhật hoặc tạo mới PrinterReport
//         await prisma.printerReport.upsert({
//           where: {
//             printer_id_year_month: {
//               printer_id: result.printer_id,
//               year,
//               month,
//             },
//           },
//           update: {
//             order_count: { increment: 1 },
//           },
//           create: {
//             printer_id: result.printer_id,
//             year,
//             month,
//             order_count: 1,
//           },
//         });

//         return result;
//       },
//     },
//   },
// });


async function initializeData() {
  try {
    // Kiểm tra và thêm dữ liệu mặc định cho bảng "User"
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      const salt = bcrypt.genSaltSync(10);
      const pass1 = bcrypt.hashSync("spso123", salt);
      const pass2 = bcrypt.hashSync("student123", salt);
      const pass3 = bcrypt.hashSync("lecturer123", salt);
      await prisma.user.createMany({
        data: [
          {
            username: "spso",
            password: pass1, // Mật khẩu nên mã hóa trong thực tế
            email: "spso@example.com",
            role: "SPSO",
          },
          {
            username: "student",
            password: pass2,
            email: "student@example.com",
            role: "STUDENT",
          },
          {
            username: "lecturer",
            password: pass3,
            email: "lecturer@example.com",
            role: "LECTURER",
          },
        ],
      });
      console.log("Default users have been added.");
    }

    // Kiểm tra và thêm dữ liệu mặc định cho bảng "Printer"
    const printerCount = await prisma.printer.count();
    if (printerCount === 0) {
      await prisma.printer.createMany({
        data: [
          {
            name: "Printer 1",
            brand: "Canon",
            model: "LBP6030",
            description: "Compact laser printer for home use.",
            loc_campus: "TWO",
            loc_building: "H1",
            loc_room: "108",
          },
          {
            name: "Printer 2",
            brand: "HP",
            model: "LaserJet Pro",
            description: "High-speed office printer.",
            loc_campus: "TWO",
            loc_building: "H2",
            loc_room: "405",
          },
        ],
      });
      console.log("Default printers have been added.");
    }

    // Kiểm tra và thêm dữ liệu mặc định cho bảng "Document"
    const documentCount = await prisma.document.count();
    if (documentCount === 0) {
      await prisma.document.createMany({
        data: [
          {
            filename: "Document 1",
            mimetype: "application/pdf",
            size: 512,
            url: "http://example.com/document1.pdf",
            user_id: 1,
            path: "242434-document1.pdf",
          },
          {
            filename: "Document 2",
            mimetype: "application/msword",
            size: 256,
            url: "http://example.com/document2.docx",
            user_id: 2,
            path: "234324-document2.docx",
          },
        ],
      });
      console.log("Default documents have been added.");
    }

    // Kiểm tra và thêm dữ liệu mặc định cho bảng "PrintOrder"
    const printOrderCount = await prisma.printOrder.count();
    if (printOrderCount === 0) {
      await prisma.printOrder.createMany({
        data: [
          {
            side: "ONE",
            page_size: "A4",
            orientation: "PORTRAIT",
            pages_per_sheet: 1,
            scale: 1.0,
            user_id: 1,
            printer_id: 1,
            document_id: 1,
          },
          {
            side: "TWO",
            page_size: "A3",
            orientation: "PORTRAIT",
            pages_per_sheet: 1,
            scale: 1.2,
            user_id: 2,
            printer_id: 2,
            document_id: 2,
          }
        ],
      });
      console.log("Default print orders have been added.");
      // thêm các dữ liệu mặc định cho bảng Report
      const reportCount = await prisma.report.count();
      if (reportCount === 0) {
        await prisma.report.createMany({
          data: [],
        });
      }
    }
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

async function main() {
  try {
    // Kết nối Prisma
    await prisma.$connect();
    console.log("Prisma connected successfully.");

    // Gọi hàm khởi tạo dữ liệu
    await initializeData();
  } catch (error) {
    console.error("Failed to connect Prisma:", error);
  } finally {
    // Đảm bảo đóng kết nối Prisma khi hoàn thành
    await prisma.$disconnect();
  }
}

// Gọi hàm main
main().catch((e) => {
  console.error("Unhandled error in main:", e);
});

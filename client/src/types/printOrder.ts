export interface Printer {
  name: string;
}

export interface Document {
  filename: string;
  page_count: string;
  url: string;
}

export interface PrintOrder {
  print_id: number;
  side: "ONE" | "TWO";
  page_size: "A3" | "A4";
  orientation: "PORTRAIT" | "LANDSCAPE";
  pages_per_sheet: number;
  scale: number;
  time_start: string;
  time_end: string | null;
  status: "PENDING" | "PROGRESS" | "SUCCESS" | "FAILED" | "CANCELLED";
  pages_to_be_printed: number[];
  num_pages_consumed: number;
  document_id: number;
  user_id: number;
  printer_id: number;
  printer: Printer;
  document: Document;
}

export interface PrintOrderResponse {
  data: PrintOrder[];
  message: string;
}

// Nếu cần type cho request
export interface PrintOrderRequest {
  document_id: number;
  printer_id: number;
  side: "ONE" | "TWO";
  page_size: "A3" | "A4";
  orientation: "PORTRAIT" | "LANDSCAPE";
  pages_per_sheet: number;
  scale: number;
  pages_to_be_printed: number[];
  status: "PENDING" | "PROGRESS" | "SUCCESS" | "FAILED" | "CANCELLED";
}

// Type cho response khi tạo print order mới
export interface CreatePrintOrderResponse {
  data: PrintOrder;
  message: string;
}

// Type cho response khi thanh toán
export interface MultiplePaymentResponse {
  data: {
    orders: {
      count: number;
    };
    remainingBalance: number;
    reportResults: {
      orderId: number;
      pagesAdded: number;
    }[];
  };
  message: string;
}
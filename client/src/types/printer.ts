export interface Printer {
  printer_id: number;
  name: string;
}

export interface PrinterArrayResponse {
  data: Printer[];
  message: string;
}


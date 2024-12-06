export interface Printer {
  printer_id: number;
  name: string;
  brand: string;
  status: "RUNNING" | "DISABLED" | "DELETED";
  model: string;
  description: string;
  loc_campus: string;
  loc_building: string;
  loc_room: string;
}

export interface PrinterArrayResponse {
  data: Printer[];
  message: string;
}


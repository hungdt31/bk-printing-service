import { Printer } from "@/types/printer";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import PrinterCard from "@/components/PrinterCard";


export const columns: ColumnDef<Printer>[] = [
  {
    header: "STT",
    accessorKey: "id",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    header: "Tên máy in",
    accessorKey: "name",
  },
  {
    header: "Thương hiệu",
    accessorKey: "brand",
  },
  {
    header: "Mô hình",
    accessorKey: "model",
  },
  {
    header: "Mô tả",
    accessorKey: "description",
  },
  {
    header: "Trạng thái",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <div
          className={cn("text-xs font-bold", row.original.status === "RUNNING" ? "text-green-500" :
            row.original.status === "DELETED" ? "text-red-500" :
              "text-yellow-500")}
        >{row.original.status}</div>
      );
    },
  },
  {
    header: "Chi tiết",
    accessorKey: "printer_id",
    cell: ({ row }) => {
      return (
        <PrinterCard {...row.original} />
      );
    },
  },
];
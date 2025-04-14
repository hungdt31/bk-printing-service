import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpRight, ArrowUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PrintOrderByAdmin } from "@/types/printOrder";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<PrintOrderByAdmin>[] = [
  {
    accessorKey: "print_id",
    header: "",
    cell: ({ row }) => {
      return <div className="text-right">#{row.original.print_id}</div>;
    },
  },
  {
    accessorKey: "user.username",
    header: "Người dùng",
    cell: ({ row }) => {
      const ava = row.original.user.avatar?.url
      const index = (row.index+1) % 6 === 0 ? (row.index) : (row.index+1) % 6
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            {ava ? <AvatarImage src={ava}/> : <AvatarImage src={`/avatars/0${index}.png`}/>}
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{row.original.user.username}</p>
            <p className="text-xs">{row.original.user.email}</p>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "time_start",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold pl-0"
        >
          Thời gian bắt đầu
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.original.time_start);
      return (
        <div className="font-medium flex justify-start">
          <div className="f">
          <div>{date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}</div>
          <div className="text-sm text-gray-500">{date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}</div>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "time_end",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold pl-0"
        >
          Thời gian kết thúc
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      if (!row.original.time_end) return <span className="text-gray-500">-</span>;

      const date = new Date(row.original.time_end);
      return (
        <div className="font-medium">
          <div>{date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}</div>
          <div className="text-sm text-gray-500">{date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}</div>
        </div>
      );
    }
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      return (
        <div className={
          cn("font-bold", row.original.status === "SUCCESS" ?
            "text-green-500" : row.original.status === "FAILED" ?
              "text-red-500" : "text-yellow-500")
        }>{row.original.status}</div>
      );
    },
  },
  {
    accessorKey: "user.email",
    header: "Chi tiết",
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger>
            <ArrowUpRight size={24} />
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-4">
                Thông tin chi tiết đơn hàng
              </DialogTitle>
              <DialogDescription className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Thông tin cơ bản */}
                  <div className="space-y-2">
                    <p className="font-semibold">ID đơn hàng: <span className="font-normal">{row.original.print_id}</span></p>
                    <p className="font-semibold">Trạng thái:
                      <span className={cn(
                        "ml-2 px-2 py-1 rounded-full text-sm",
                        {
                          "bg-green-100 text-green-800": row.original.status === "SUCCESS",
                          "bg-red-100 text-red-800": row.original.status === "FAILED",
                          "bg-yellow-100 text-yellow-800": row.original.status === "CANCELLED",
                          "bg-blue-100 text-blue-800": row.original.status === "PENDING",
                        }
                      )}>
                        {row.original.status}
                      </span>
                    </p>
                    {/* <p className="font-semibold">Máy in: <span className="font-normal">{row.original.printer?.name}</span></p>
                    <p className="font-semibold">Tài liệu: <span className="font-normal">{row.original.document?.filename}</span></p> */}
                  </div>

                  {/* Thông tin thời gian */}
                  <div className="space-y-2">
                    <p className="font-semibold">Thời gian bắt đầu:
                      <span className="font-normal">
                        {new Date(row.original.time_start).toLocaleString('vi-VN')}
                      </span>
                    </p>
                    {row.original.time_end && (
                      <p className="font-semibold">Thời gian kết thúc:
                        <span className="font-normal">
                          {new Date(row.original.time_end).toLocaleString('vi-VN')}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Thông tin in ấn */}
                <div className="mt-4 space-y-2 border-t pt-4">
                  <h3 className="font-semibold text-lg mb-2">Cấu hình in</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-semibold">Khổ giấy: <span className="font-normal">{row.original.page_size}</span></p>
                      <p className="font-semibold">Hướng giấy: <span className="font-normal">{row.original.orientation == 'PORTRAIT' ? "Thẳng" : "Ngang"}</span></p>
                      <p className="font-semibold">In hai mặt: <span className="font-normal">{row.original.side === 'ONE' ? 'Không' : 'Có'}</span></p>
                      <p className="font-semibold">Máy in: <span className="font-normal">{row.original.printer.name}</span></p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Số trang trên tờ: <span className="font-normal">{row.original.pages_per_sheet}</span></p>
                      <p className="font-semibold">Tỉ lệ: <span className="font-normal">{row.original.scale * 100}%</span></p>
                      <p className="font-semibold">Số trang đã in: <span className="font-normal">{row.original.pages_to_be_printed.length}</span></p>
                      <p className="font-semibold">Nơi nhận: <span className="font-normal">{row.original.printer.loc_campus} - {row.original.printer.loc_building} - {row.original.printer.loc_room}</span></p>
                    </div>
                    <div></div>
                  </div>
                </div>

                {/* Danh sách trang in */}
                <div className="mt-4 space-y-2 border-t pt-4">
                  <h3 className="font-semibold text-lg">Danh sách trang in</h3>
                  <div className="max-h-24 overflow-y-auto bg-gray-50 p-2 rounded">
                    <p className="font-normal">
                      {row.original.pages_to_be_printed.join(', ')}
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    }
  }
];
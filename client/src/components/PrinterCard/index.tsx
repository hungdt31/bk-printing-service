import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { type Printer } from '@/types/printer'
import { ArrowUpRight, Pencil, X } from "lucide-react";
import { printerSchema } from "@/schemas/PrinterSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomField from '../CustomFormField';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/utils/constant';
import { updatePrinter } from '@/action/printer';
import { toast } from 'react-hot-toast';
import PulseLoader from 'react-spinners/PulseLoader';
// Thêm constant cho options status
const STATUS_OPTIONS = [
  { value: "RUNNING", label: "Kích hoạt" },
  { value: "DELETED", label: "Đã xóa" },
  { value: "DISABLED", label: "Vô hiệu hóa" },
];

export default function PrinterCard({
  printer_id,
  name,
  status,
  loc_building,
  loc_campus,
  loc_room,
  brand,
  model,
  description
}: Printer) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const form = useForm<z.infer<typeof printerSchema>>({
    resolver: zodResolver(printerSchema),
    defaultValues: {
      name,
      status,
      loc_building,
      loc_campus,
      loc_room,
      brand,
      model,
      description
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof printerSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    const res = await updatePrinter(printer_id, values);
    if (res.data) {
      toast.success(res.message);
      queryClient.setQueryData([queryKeys.printers], (oldData: Printer[]) => {
        return oldData.map((printer) => printer.printer_id === printer_id ? { ...printer, ...values } : printer);
      });
    } else {
      toast.error(res.message);
    }
    setIsEdit(false);
    setIsLoading(false);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowUpRight className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Chi tiết máy in
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 grid-cols-2 items-center">
              <CustomField
                control={form.control}
                name="name"
                label="Tên máy in"
                placeholder="Nhập tên máy in"
                disabled={!isEdit}
              />
              <CustomField
                control={form.control}
                name="status"
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                type="select"
                options={STATUS_OPTIONS}
                disabled={!isEdit}
              />
              <CustomField
                control={form.control}
                name="loc_building"
                label="Tòa nhà"
                placeholder="Nhập tòa nhà"
                disabled={!isEdit}
              />
              <CustomField
                control={form.control}
                name="loc_room"
                label="Phòng"
                placeholder="Nhập phòng"
                disabled={!isEdit}
              />
              <CustomField
                control={form.control}
                name="loc_campus"
                label="Cơ sở"
                placeholder="Nhập cơ sở"
                disabled={!isEdit}
              />
              <CustomField
                control={form.control}
                name="brand"
                label="Thương hiệu"
                placeholder="Nhập thương hiệu"
                disabled={!isEdit}
              />
              <CustomField
                control={form.control}
                name="model"
                label="Model"
                placeholder="Nhập model"
                disabled={!isEdit}
              />
            </div>
            <CustomField
              control={form.control}
              name="description"
              label="Mô tả"
              placeholder="Nhập mô tả"
              type="textarea"
              disabled={!isEdit}
            />

            {isLoading ? (
              <PulseLoader color="#000" />
            ) : (
              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => {
                    // Lấy data hiện tại từ cache
                    const printers = queryClient.getQueryData<Printer[]>(['printers']);
                    const currentPrinter = printers?.find(p => p.printer_id === printer_id);
                    
                    // Reset form về giá trị từ cache
                    if (currentPrinter) {
                      form.reset({
                        name: currentPrinter.name,
                        status: currentPrinter.status,
                        loc_building: currentPrinter.loc_building,
                        loc_campus: currentPrinter.loc_campus,
                        loc_room: currentPrinter.loc_room,
                        brand: currentPrinter.brand,
                        model: currentPrinter.model,
                        description: currentPrinter.description,
                      });
                    }
                    setIsEdit(prev => !prev);
                  }}
                >
                  {isEdit ? (
                    <span className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Hủy
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      Chỉnh sửa
                    </span>
                  )}
                </Button>
                {isEdit && (
                  <Button type="submit" variant="default">
                    Lưu thay đổi
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

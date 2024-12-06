import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigSchema } from "@/schemas/ConfigSchema";
import CustomField from "@/components/CustomFormField";
import { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";
import { z } from "zod";
import AdminWrapper from "@/components/AdminWrapper";
import { useGetConfig } from "@/hooks/config";
import ErrorPage from "@/components/Error";
import { LoadingFullLayout } from "@/components/LoadingFullLayout";
import PermittedFile from "@/components/PermittedFile";
import { updateConfig } from "@/action/config";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { data, isLoading, isError, refetch } = useGetConfig();
  const form = useForm<z.infer<typeof ConfigSchema>>({
    resolver: zodResolver(ConfigSchema)
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
      setSelectedFile(data.PERMITTED_FILE_TYPES);
    }
  }, [data, refetch]);

  function resetForm() {
    if (isEdit && data) {
      form.reset(data);
      setSelectedFile(data.PERMITTED_FILE_TYPES);
    }
    setIsEdit(!isEdit);
  }
  
  async function onSubmit(values: z.infer<typeof ConfigSchema>) {
    setIsFetching(true);
    values.PERMITTED_FILE_TYPES = selectedFile;
    // console.log(values);
    const rs = await updateConfig(values);
    if (rs.data) {
      await refetch();
      toast.success(rs.message);
    } else {
      resetForm();
      toast.error(rs.message);
    }
    setIsFetching(false);
    setIsEdit(false);
  }

  
  if (isLoading) return <LoadingFullLayout />;
  if (isError) return <ErrorPage />

  return (
    <AdminWrapper title="Cấu hình hệ thống">
      <div className="flex justify-between items-center mb-6">
        <Button
          disabled={isFetching}
          variant="outline"
          onClick={resetForm}
        >
          {isEdit ? (
            <span className="flex items-center gap-2 text-red-500">
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
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <CustomField
              control={form.control}
              name="DEFAULT_BALANCE"
              label="Số dư mặc định"
              placeholder="Nhập số dư mặc định"
              type="number"
              max={100}
              step={1}
              disabled={!isEdit}
            />
            <CustomField
              control={form.control}
              name="DATE_TO_UPDATE"
              label="Thời gian cập nhật (Cron)"
              placeholder="Nhập thời gian cập nhật"
              disabled={!isEdit}
            />
            <CustomField
              control={form.control}
              name="MAX_FILE_SIZE"
              label="Kích thước tối đa (bytes)"
              placeholder="Nhập kích thước tối đa"
              type="number"
              max={30000000}
              step={1}
              disabled={!isEdit}
            />
            <CustomField
              control={form.control}
              name="PRICE_PER_A4"
              label="Giá mỗi trang A4 (đ)"
              placeholder="Nhập giá mỗi trang A4"
              type="number"
              step={100}
              max={3000}
              disabled={!isEdit}
            />
          </div>
          <PermittedFile disabledButton={!isEdit} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
          {isEdit && (
            <div className="flex justify-end mt-6">
              <Button 
                disabled={isFetching}
                type="submit" 
                variant={"secondary"}
              >
                Lưu thay đổi
              </Button>
            </div>
          )}
        </form>
      </Form>
    </AdminWrapper>
  );
}
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { PrintOrderSchema } from "@/schemas/PrintOrderSchema";
import CustomField from "@/components/CustomFormField";
import { getPrinters } from "@/data/printer";
import { Printer } from "@/types/printer";
import { RotateCcw, ShoppingCart, MessageCircleWarning } from "lucide-react";
import { paths } from "@/utils/path";
import { Link } from "react-router-dom";
import { createOrder } from "@/action/printOrder";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useListPrintOrders } from "@/hooks/printOrder";
// import OrderCard from "@/components/OrderCard";
import { localStorageKeys } from "@/utils/constant";

export const SettingsForm = ({
  documentId,
  page_count,
  balance,
}: {
  documentId: number,
  page_count: number,
  balance: number,
}) => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [consumedPages, setConsumedPages] = useState<number>(0);
  const { refetch } = useListPrintOrders();
  const navigate = useNavigate();
  const initialPages = Array.from({ length: page_count }, (_, index) => index + 1);

  const form = useForm<z.infer<typeof PrintOrderSchema>>({
    resolver: zodResolver(PrintOrderSchema),
    defaultValues: async () => {
      setIsPending(true);
      let printerList = await getPrinters();
      printerList = printerList.filter(item => item.status === 'RUNNING');
      setPrinters(printerList);
      setSelectedPages(initialPages);
      setIsPending(false);

      return {
        side: 'ONE',
        page_size: 'A4',
        orientation: 'PORTRAIT',
        pages_per_sheet: 1,
        scale: 1.0,
        status: 'PENDING',
        pages_to_be_printed: initialPages.length > 0 ? initialPages : [1],
        printer_id: printerList.length > 0 ? printerList[0].printer_id : 1,
        document_id: documentId
      };
    },
  });

  const handlePageClick = (pageNumber: number) => {
    setSelectedPages(prev => {
      if (prev.includes(pageNumber) && prev.length > 1) {
        const newSelection = prev.filter(p => p !== pageNumber);
        form.setValue('pages_to_be_printed', newSelection);
        return newSelection;
      }
      else if (!prev.includes(pageNumber)) {
        const newSelection = [...prev, pageNumber].sort((a, b) => a - b);
        form.setValue('pages_to_be_printed', newSelection);
        return newSelection;
      }
      return prev;
    });
  };

  const resetPageSelection = () => {
    setSelectedPages(initialPages);
    form.setValue('pages_to_be_printed', initialPages);
  };

  async function onSubmit(values: z.infer<typeof PrintOrderSchema>) {
    setIsPending(true);
    const result = await createOrder(values);
    if (result.data) {
      await refetch();
      toast.success(result.message);
      navigate(paths.Order);
    } else {
      toast.error(result.message);
    }
    setIsPending(false);
  }

  // Watch for changes in page_size
  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === 'page_size' || !name) {
        const isA4 = form.getValues('page_size') === 'A4';
        setConsumedPages(isA4 ? selectedPages.length : selectedPages.length * 2);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, selectedPages]);

  // Update consumedPages when selectedPages changes
  useEffect(() => {
    const isA4 = form.getValues('page_size') === 'A4';
    setConsumedPages(isA4 ? selectedPages.length : selectedPages.length * 2);
  }, [selectedPages, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
          <CustomField
            control={form.control}
            name="printer_id"
            label="Máy in"
            placeholder="Chọn máy in"
            type="select"
            disabled={isPending || printers.length === 0}
            horizontal
            options={
              printers.map((item: Printer) => ({
                value: item.printer_id.toString(),
                label: item.name
              }))
            }
          />
          <CustomField
            control={form.control}
            name="side"
            label="Chế độ in"
            placeholder="Chọn chế độ in"
            type="select"
            disabled={isPending}
            horizontal
            options={[
              { value: 'ONE', label: 'Một mặt' },
              { value: 'TWO', label: 'Hai mặt' },
            ]}
          />
          <CustomField
            control={form.control}
            name="page_size"
            label="Kích thước giấy"
            placeholder="Chọn kích thước"
            type="select"
            disabled={isPending}
            horizontal
            options={[
              { value: 'A4', label: 'A4' },
              { value: 'A3', label: 'A3' },
            ]}
          />
          <CustomField
            control={form.control}
            name="orientation"
            label="Hướng in"
            placeholder="Chọn hướng in"
            type="select"
            disabled={isPending}
            horizontal
            options={[
              { value: 'PORTRAIT', label: 'Dọc' },
              { value: 'LANDSCAPE', label: 'Ngang' },
            ]}
          />
          <CustomField
            control={form.control}
            name="pages_per_sheet"
            label="Số trang/tờ"
            placeholder="Nhập số trang trên mỗi tờ"
            type="number"
            max={page_count}
            step={1}
            disabled={isPending}
            horizontal
          />
          <CustomField
            control={form.control}
            name="scale"
            label="Tỷ lệ"
            placeholder="Nhập tỷ lệ in"
            type="number"
            max={3}
            disabled={isPending}
            horizontal
          />
        </div>
        <div className="flex items-center gap-5 my-5">
          <p className="text-sm font-semibold min-w-[100px]">Chọn trang in</p>
          <div className="flex items-center gap-2 overflow-x-scroll">
            {Array.from({ length: page_count }, (_, index) => {
              const pageNum = index + 1;
              return (
                <Button
                  key={index}
                  variant={selectedPages.includes(pageNum) ? "default" : "outline"}
                  className="w-10 h-10"
                  type="button"
                  onClick={() => handlePageClick(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={resetPageSelection}
            className="rounded-full text-sm"
            disabled={isPending}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center justify-between gap-5">
            <Button className="text-sm font-semibold" variant={"secondary"}>Số trang khả dụng: {balance}</Button>
            <Button className="text-sm font-semibold" variant={"secondary"}>Số trang tiêu tốn: {consumedPages}</Button>
          </div>
          {consumedPages > balance && (
            <Link to={paths.Purchase}>
              <Button
                variant={"link"}
                className="text-yellow-500"
                onClick={() => {
                  window.localStorage.setItem(localStorageKeys.pageAdded, (consumedPages - balance).toString());
                }}
              >
                <MessageCircleWarning /> Cần mua thêm {consumedPages - balance} trang.
              </Button>
            </Link>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-5">Số trang tiêu tốn là số trang tính vào số trang khả dụng của bạn. Nếu bạn chọn in giấy A3 thì số trang tiêu tốn sẽ gấp đôi số trang in.</p>
        <div className="flex flex-col">
          <p className="font-semibold text-md">Các nơi nhận:</p>
          <ul className="grid sm:grid-cols-2">
            {printers
              .map((printer: Printer) => (
                <li key={printer.printer_id}>
                  {printer.name} - {printer.loc_campus} - {printer.loc_building} - {printer.loc_room}
                </li>
              ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
          {isPending ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              <span className="text-green-700 text-sm">Đang xử lý...</span>
            </>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              variant="outline"
              className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white px-6 py-5"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />

              <span className="border-l-2 border-green-700 pl-2">Thêm vào giỏ hàng</span>
            </Button>
          )}
          {/* <OrderCard order={form.getValues()} disabled={isPending || consumedPages > balance} /> */}
        </div>
      </form>
    </Form>
  );
}

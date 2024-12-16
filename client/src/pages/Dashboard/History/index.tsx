import { DashboardWrapper } from "@/components/DashboardWrapper"
import { SimpleDataTable } from "@/components/SimpleDatable"
import { usePrintOrderHistory } from "@/hooks/printOrder"
import { columns } from "@/pages/Dashboard/History/column"
import { searchPrintOrder } from "@/schemas/PrintOrderSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import CustomField from "@/components/CustomFormField"
import { Form } from "@/components/ui/form"
import { usePrinter } from "@/hooks/printer"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export const HistoryLog = () => {
  const [printers, setPrinters] = useState<{
    value: string,
    label: string
  }[]>
    ([])
  const { data: printOrderData, isPending, mutateAsync } = usePrintOrderHistory();
  const { data: printerData, isLoading } = usePrinter();
  const year = new Date().getFullYear();
  const form = useForm<z.infer<typeof searchPrintOrder>>({
    resolver: zodResolver(searchPrintOrder),
    defaultValues: {
      time_start: new Date(year, 1, 1),
      time_end: new Date(year, 12, 1),
    }
  });

  function onSubmit(values: z.infer<typeof searchPrintOrder>) {
    mutateAsync(values);
  }

  useEffect(() => {
    if (printerData) {
      form.setValue('printer_id', printerData[0].printer_id);
      const array = printerData.map((el) => ({
        value: el.printer_id.toString(),
        label: el.name
      }));
      array.push({
        value: '0',
        label: 'Toàn bộ'
      })
      setPrinters(array)
      mutateAsync({
        time_start: new Date(year, 1, 1),
        time_end: new Date(year, 12, 1),
      })
    }
  }, [printerData, form]);

  return (
    <DashboardWrapper
      title="Nhật ký in ấn của người dùng"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <div className="flex items-center gap-3 border-[1px] shadow-md w-fit px-3">
            <div className='flex gap-3 flex-wrap'>
              <CustomField
                type='date'
                name='time_start'
                horizontal
                placeholder='Thời gian bắt đầu'
                control={form.control}
                label='Thời gian bắt đầu'
                className='p-3'
                labelClassName='font-bold'
              />
              <CustomField
                type='date'
                name='time_end'
                horizontal
                placeholder='Thời gian kết thúc'
                control={form.control}
                label='Thời gian kết thúc'
                className='p-3'
                labelClassName='font-bold'
              />
              {!isLoading && <CustomField
                type='select'
                horizontal
                options={printers}
                name='printer_id'
                placeholder='Máy in'
                control={form.control}
                label='Chọn máy in'
                className='p-3 justify-between'
                labelClassName='font-bold'
              />}
            </div>
            <Button type="submit" className="mt-2"><Search /> Tìm kiếm</Button>
          </div>
          <SimpleDataTable isLoading={isPending} variant='none' columns={columns} data={printOrderData || []} />
        </form>
      </Form>
    </DashboardWrapper>
  )
}
import AdminWrapper from '@/components/AdminWrapper'
import CustomField from '@/components/CustomFormField'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { searchPrintOrder } from '@/schemas/PrintOrderSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { SearchCheck, Filter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePrintOrdersByAdmin } from '@/hooks/printOrder'
import { usePrinter } from '@/hooks/printer'
import { columns } from './columns'
import { SimpleDataTable } from '@/components/SimpleDatable'

export default function HistoryPage() {
  // 1. Define your form.
  const year = new Date().getFullYear()
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [printers, setPrinters] = useState<{
    value: string,
    label: string
  }[]>
    ([])
  const { data: printerData } = usePrinter();
  const { data: printOrderData, mutateAsync, isPending } = usePrintOrdersByAdmin();
  const form = useForm<z.infer<typeof searchPrintOrder>>({
    resolver: zodResolver(searchPrintOrder),
    defaultValues: {
      name: '',
      status: 'ALL',
      time_start: new Date(year, 1, 1),
      time_end: new Date(year, 12, 1),
    }
  })

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
    }
  }, [printerData, form]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof searchPrintOrder>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    mutateAsync(values);
  }

  // Watch for changes in the form values
  // const { watch } = form;
  // useEffect(() => {
  //   const subscription = watch((values) => {
  //     console.log('Form values changed:', values);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  return (
    <AdminWrapper title='Lịch sử in'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
          <div className='flex items-center gap-3'>
            <Button type='button' className='bg-green-700 hover:bg-green-500' onClick={() => setIsOpen(prev => !prev)}>
              <Filter /> Bộ lọc
            </Button>
            <Button type='submit'>
              <SearchCheck /> Tìm kiếm
            </Button>
          </div>
          {isOpen &&
            <div className='grid lg:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-3 items-stretch'>
              <CustomField
                type='text'
                name='name'
                placeholder='shadcn'
                control={form.control}
                label='Tên người dùng'
                className='p-3'
                labelClassName='font-bold'
              />
              <CustomField
                type='date'
                name='time_start'
                placeholder='Thời gian bắt đầu'
                control={form.control}
                label='Thời gian bắt đầu'
                className='p-3'
                labelClassName='font-bold'
                inputClassName='rounded-full'
              />
              <CustomField
                type='date'
                name='time_end'
                placeholder='Thời gian kết thúc'
                control={form.control}
                label='Thời gian kết thúc'
                className='p-3'
                labelClassName='font-bold'
                inputClassName='rounded-full'
              />
              <CustomField
                type='select'
                options={[
                  { value: 'PENDING', label: 'Chờ xử lý' },
                  { value: 'SUCCESS', label: 'Thành công' },
                  { value: 'CANCELLED', label: 'Hủy bỏ' },
                  { value: 'ALL', label: 'Toàn bộ' }
                ]}
                name='status'
                placeholder='Trạng thái'
                control={form.control}
                label='Trạng thái'
                className='p-3 justify-between'
                labelClassName='font-bold'
                inputClassName='rounded-full'
              />
              <CustomField
                type='select'
                options={printers}
                name='printer_id'
                placeholder='Máy in'
                control={form.control}
                label='Chọn máy in'
                className='p-3 justify-between'
                labelClassName='font-bold'
                inputClassName='rounded-full'
              />
            </div>
          }
          <SimpleDataTable isLoading={isPending} variant='none' columns={columns} data={printOrderData || []} />
        </form>
      </Form>
    </AdminWrapper>
  )
}

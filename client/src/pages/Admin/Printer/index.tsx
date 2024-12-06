import AdminWrapper from '@/components/AdminWrapper';
import { usePrinter } from '@/hooks/printer';
import { columns } from './columns';
import { DataTable } from '@/components/DataTable';
import { LoadingFullLayout } from '@/components/LoadingFullLayout';
import ErrorPage from '@/components/Error';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { newPrinterSchema } from '@/schemas/PrinterSchema';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from '@/components/ui/form';
import CustomField from '@/components/CustomFormField';
import { useState } from 'react';
import { createPrinter } from '@/action/printer';
import toast from 'react-hot-toast';

export default function PrinterPage() {
  // 1. Define your form.
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const form = useForm<z.infer<typeof newPrinterSchema>>({
    resolver: zodResolver(newPrinterSchema),
    defaultValues: {
      name: 'Printer #',
      brand: 'N/A',
      model: 'N/A',
      loc_campus: 'ONE',
      loc_building: 'H1',
      loc_room: '106',
      status: 'RUNNING'
    }
  })
  const { data, isLoading, isError, refetch } = usePrinter();


  // const defaultValues = {
  //   name: '',
  //   brand: '',
  //   model: '',
  //   loc_campus: '',
  //   loc_building: '',
  //   loc_room: '',
  //   status: 'RUNNING'
  // }


  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof newPrinterSchema>) {
    setIsFetching(true)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const rs = await createPrinter(values);
    if (rs.data) {
      await refetch();
      toast.success(rs.message)
    } else {
      toast.error(rs.message)
    };
    // console.log(values)
    setIsFetching(false)
  }
  if (isLoading) return <LoadingFullLayout />
  if (isError) return <ErrorPage />
  return (
    <AdminWrapper title="Quản lý máy in">
      <DataTable columns={columns} data={data || []} variant='sub' >
        <div className='mb-5 flex items-start gap-3'>
          <Button className='bg-white text-gray-500 hover:bg-white hover:text-gray-400'>
            <p className='border-r-2 pr-2 text-sm '>Máy in khả dụng</p> {data?.filter((el) => el.status === 'RUNNING').length}
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button className='rounded-full' variant={"outline"} disabled={isFetching}>
                <CirclePlus />
                <span>Thêm máy in</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Điền các thông tin sau</DialogTitle>
                <DialogDescription>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 mt-5'>
                      <div className="grid grid-cols-2 gap-2">
                        <CustomField
                          name='name'
                          label='Tên máy in'
                          placeholder=''
                          control={form.control}
                        />
                        <CustomField
                          name='brand'
                          label='Thương hiệu'
                          placeholder=''
                          control={form.control}
                        />
                        <CustomField
                          name='model'
                          label='Model'
                          placeholder=''
                          control={form.control}
                        />
                        <CustomField
                          type='select'
                          name='loc_campus'
                          label='Cơ sở'
                          placeholder='ONE'
                          options={[
                            {
                              value: 'ONE',
                              label: 'ONE'
                            },
                            {
                              value: 'TWO',
                              label: 'TWO'
                            }
                          ]}
                          control={form.control}
                        />
                        <CustomField
                          type='select'
                          name='loc_building'
                          label='Tòa nhà'
                          placeholder='H1'
                          options={[
                            {
                              value: 'H1',
                              label: 'H1'
                            },
                            {
                              value: 'H2',
                              label: 'H2'
                            },
                            {
                              value: 'H3',
                              label: 'H3'
                            },
                            {
                              value: 'H6',
                              label: 'H6'
                            }
                          ]}
                          control={form.control}
                        />
                        <CustomField
                          name='loc_room'
                          label='Phòng'
                          placeholder=''
                          control={form.control}
                        />
                      </div>
                      <CustomField
                        name='description'
                        label='Mô tả'
                        placeholder='something about this printer'
                        control={form.control}
                      />
                      <div className='flex justify-center gap-3'>
                        <Button type="button" onClick={() => form.reset({
                          name: '',
                          brand: '',
                          model: '',
                          loc_campus: 'ONE',
                          loc_building: 'H1',
                          loc_room: '',
                          status: 'RUNNING'
                        })} variant={"secondary"} disabled={isFetching}>Clear</Button>
                        <Button type="submit" disabled={isFetching}>Submit</Button>
                      </div>
                    </form>
                  </Form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </DataTable>
    </AdminWrapper>
  );
}

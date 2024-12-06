import AdminWrapper from '@/components/AdminWrapper'
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from 'react'
import { useGenerateReport } from '@/hooks/report';
import { LoadingFullLayout } from '@/components/LoadingFullLayout';
import ErrorPage from '@/components/Error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatCurrency } from '@/helpers/format';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReportPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const startYear = 2023; // Adjust the start year as needed
  const year_array = [];
  const month_array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const { data, mutateAsync, isPending, isError } = useGenerateReport();

  for (let year = currentYear; year >= startYear; year--) {
    year_array.push(year);
  }

  useEffect(() => {
    mutateAsync({ year, month: month === 0 ? undefined : month });
  }, [year, month, mutateAsync]);

  const paymentData = {
    labels: data?.purchaseOrder.payments.map(payment => payment[0]),
    datasets: [
      {
        label: 'Thanh toán',
        data: data?.purchaseOrder.payments.map(payment => payment[1]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <AdminWrapper title="Báo cáo">
      <div className='space-y-3'>
        <div className='flex items-center gap-5 flex-wrap'>
          <div className='flex items-center gap-2'>
            <Label className='font-bold italic'>Tháng</Label>
            <Select defaultValue={currentMonth.toString()} onValueChange={(e) => setMonth(Number(e))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Lọc theo tháng</SelectLabel>
                  <div className='grid grid-cols-2 gap-3'>
                    {
                      month_array.map((month) => (
                        <SelectItem key={month} value={month.toString()} className='border-b-2 border-black text-center rounded-none'>
                          {month}
                        </SelectItem>
                      ))
                    }
                    <SelectItem value="0" className='border-b-2 border-black text-center rounded-none'>Tất cả</SelectItem>
                  </div>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <Label className='font-bold italic'>Năm</Label>
            <Select defaultValue={currentYear.toString()} onValueChange={(e) => setYear(Number(e))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Lọc theo năm</SelectLabel>
                  {
                    year_array.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {isPending && <LoadingFullLayout />}
        {isError && <ErrorPage />}
        {data && (
          <div className='grid sm:grid-cols-2 gap-3'>
            <Card className='shadow-lg'>
              <CardHeader>
                <CardTitle className='text-xl font-bold'>Đơn in</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid sm:grid-cols-2 gap-2'>
                  <div className='border-[1px] p-2 flex justify-center items-center gap-3 rounded-lg border-primary'>
                    <p className='text-primary'>Tổng số trang A4</p>
                    <Badge className='rounded-full'>{data.printOrder.totalA4Pages}</Badge>
                  </div>
                  <div className='border-[1px] p-2 flex justify-center items-center gap-3 rounded-lg border-primary'>
                    <p className='text-primary'>Tổng số trang A3</p>
                    <Badge className='rounded-full'>{data.printOrder.totalA3Pages}</Badge>
                  </div>
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className='flex flex-col'>
                      <p className='font-semibold'>Sử dụng dịch vụ</p>
                      <p className='text-gray-400 text-xs'>Thông tin người dùng và số trang họ tiêu dùng</p>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className='grid sm:grid-cols-2 gap-2'>
                        {data.printOrder.usersUsedService.map((user, index) => (
                          <li key={user.user_id} className='flex items-center flex-wrap gap-1'>
                            <Avatar className="h-9 w-9">
                              {user.avatar ? <AvatarImage src={user.avatar.url} alt="Avatar" />
                                : <AvatarImage src={`/avatars/0${index + 1}.png`} alt="Avatar" />}
                            </Avatar>
                            <div className='flex flex-col'>
                              <p className='text-sm font-semibold'>{user.username}</p>
                              <span className='text-xs italic'>{user.email}</span>
                            </div>
                            <span className='grow flex justify-end'>
                              <Button variant={"link"}>
                                {user.totalConsumedPages}
                              </Button>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            <Card className='row-span-2 shadow-lg'>
              <CardHeader>
                <CardTitle className='text-xl font-bold'>Đơn mua</CardTitle>
              </CardHeader>
              <CardContent>
                <p><span className='font-semibold'>Doanh thu</span>: {formatCurrency(data.purchaseOrder.total)}</p>
                <p className='font-semibold'>Phương thức thanh toán</p>
                <Pie data={paymentData} />
              </CardContent>
            </Card>
            <Card className='shadow-lg'>
              <CardHeader>
                <CardTitle className='text-xl font-bold'>Máy in</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of printers.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Tên máy in</TableHead>
                      <TableHead className='text-center'>Trạng thái</TableHead>
                      <TableHead className='text-center'>Số đơn in</TableHead>
                      <TableHead className="text-center">Thời gian in (phút)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      data.printer.printers.map(printer => (
                        <TableRow key={printer.name}>
                          <TableCell className='font-semibold'>{printer.name}</TableCell>
                          <TableCell className={cn(
                            'text-center',
                            printer.status === 'RUNNING' ? 'text-green-500' :
                              printer.status === 'DISABLED' ? 'text-yellow-500' : 'text-red-500'
                          )}>{printer.status}</TableCell>
                          <TableCell className='text-center'>{printer._count.printOrders}</TableCell>
                          <TableCell className="text-center">{printer._count.printingTime.toFixed(3)}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Tổng thời gian in</TableCell>
                      <TableCell className="text-center">{data.printer.totalUsingPrinters.toFixed(3)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminWrapper>
  )
}
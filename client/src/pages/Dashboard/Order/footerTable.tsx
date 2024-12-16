import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PurchaseSchema } from '@/schemas/Purchase';
import { toast } from 'react-hot-toast';
import { purchaseAndPayment } from '@/action/printOrder';
import { useGetConfig } from '@/hooks/config';
import { PrintOrder } from '@/types/printOrder';
import { formatCurrency } from '@/helpers/format';
import { SquareSigma } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import CustomField from '@/components/CustomFormField';
import { paymentMethods } from '@/utils/constant';
import { paymentOrder } from "@/action/printOrder";
import { useProfile } from "@/hooks/user";
import { useListPrintOrders } from "@/hooks/printOrder";
import { usePrintOrderHistory } from "@/hooks/printOrder";
import { useNavigate } from 'react-router-dom';
import { paths } from '@/utils/path';

interface FooterProps {
  table: Table<any>; // Adjust the type according to your table instance
  actionLabel?: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FooterTable: React.FC<FooterProps> = ({ table, actionLabel, isLoading, setIsLoading }) => {
  const { refetch: refetchListPrintOders } = useListPrintOrders();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const { reset } = usePrintOrderHistory();
  const { data: config } = useGetConfig();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof PurchaseSchema>>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      method: "BANKING",
      amount: 1
    }
  });

  const totalPagesConsumed = table.getFilteredSelectedRowModel().rows.reduce((acc, row) => acc + (row.original as PrintOrder).num_pages_consumed, 0);

  const selectedIds = table.getFilteredSelectedRowModel().rows.map(
    (row) => (row.original as PrintOrder).print_id
  );

  const refetchData = async () => {
    await refetchListPrintOders();
    await refetchProfile();
    reset();
    navigate(paths.History);
  }

  const handlePayment = async () => {
    // Handle payment logic here
    setIsLoading(true);
    const result = await paymentOrder(selectedIds);
    if (result.data) {
      await refetchData();
      toast.success(result.message);
    } else {
      toast.error(result.message)
    }
    setIsLoading(false);
    // console.log("Processing payment for IDs:", selectedIds)
  };

  async function onSubmit(values: z.infer<typeof PurchaseSchema>) {
    setIsLoading(true);
    if (profile) values.amount = totalPagesConsumed - profile.balance;
    const rs = await purchaseAndPayment({ purchasePayload: values, print_ids: selectedIds });
    if (rs.data) {
      await refetchData();
      toast.success(rs.message);
      
    } else {
      toast.error(rs.message);
    }
    setIsLoading(false);
    // console.log(values, selectedIds);
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <Button variant="outline" className="text-primary px-6 py-5">
        <p className="text-sm">Tổng số trang in:</p>
        <span>{totalPagesConsumed}</span>
      </Button>
      {profile && profile.balance < totalPagesConsumed ? (
        <Dialog>
          <DialogTrigger>
            <Button>Thanh toán</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-bold">Thực hiện in</DialogTitle>
              <DialogDescription>
                Cần mua thêm <span className="text-yellow-500">{totalPagesConsumed - profile.balance} trang in</span>
              </DialogDescription>
              <div className="space-y-3">
                {config && (
                  <Button variant={"outline"}>
                    <SquareSigma /> <span className="border-r-2 pr-3">{table.getFilteredRowModel().rows.length} đơn hàng</span>  -{formatCurrency((totalPagesConsumed - profile.balance) * config.PRICE_PER_A4)}
                  </Button>
                )}
                <p className="text-center">Chọn phương thức thanh toán</p>
                <div className="space-y-2">
                  <Form {...form}>
                    <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
                      {paymentMethods.map((method, index) => (
                        <div className="flex items-center justify-between gap-2 border-2 border-gray-500 rounded-md p-2" key={index}>
                          <CustomField
                            type="radio"
                            label={method.label}
                            name="method"
                            control={form.control}
                            horizontal
                            labelPosition="after"
                            className="justify-start space-y-0"
                            labelClassName="text-md"
                            placeholder={method.label}
                            radioValue={method.value}
                          />
                          <img src={method.logo} alt={method.label} className="w-10 h-10" />
                        </div>
                      ))}
                      <div className="flex justify-center flex-wrap gap-3">
                        <DialogClose><Button variant={"destructive"} className="min-w-[100px]" type="button" disabled={isLoading}>Hủy</Button></DialogClose>
                        <Button className="min-w-[100px]" type="submit" disabled={isLoading}>Xác nhận</Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        <Button
          className="px-6 py-5"
          onClick={handlePayment}
          disabled={table.getFilteredSelectedRowModel().rows.length === 0 || isLoading}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default FooterTable;
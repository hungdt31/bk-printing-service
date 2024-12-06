import { DashboardWrapper } from "@/components/DashboardWrapper"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { PurchaseSchema } from "@/schemas/Purchase"
import type { z } from "zod"
import CustomField from "@/components/CustomFormField"
import { localStorageKeys, paymentMethods } from "@/utils/constant"
import { Form } from "@/components/ui/form"
import { useGetConfig } from "@/hooks/config"
import { formatCurrency } from "@/helpers/format"
import { LoadingFullLayout } from "@/components/LoadingFullLayout"
import ErrorPage from "@/components/Error"
import { useWindowWidth } from "@react-hook/window-size"
import toast from "react-hot-toast"
import { purchase } from "@/action/purchaseOrder"
import { useProfile } from "@/hooks/user"
import { MdAccountBalanceWallet } from "react-icons/md";
import { TbSum } from "react-icons/tb";
import { useState } from "react";

export const PurchasePage = () => {
  const { data: profile, refetch } = useProfile();
  const [isPending, setIsPending] = useState(false);
  const width = useWindowWidth();
  const form = useForm<z.infer<typeof PurchaseSchema>>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      method: "BANKING",
      amount: Number(window.localStorage.getItem(localStorageKeys.pageAdded)) || 1
    }
  });
  const { data: config, isLoading, isError } = useGetConfig();
  if (isLoading) return <LoadingFullLayout />;
  if (isError) return <ErrorPage />;
  const onSubmit = async (data: z.infer<typeof PurchaseSchema>) => {
    setIsPending(true);
    const response = await purchase(data);
    if (response.data) {
      await refetch();
      toast.success(response.message);
    }
    else {
      toast.error(response.message);
    }
    setIsPending(false);
    // Xử lý logic submit ở đây
  };

  return (
    <DashboardWrapper title="Trang in">
      {profile && <div className="text-sm flex items-center gap-2 border-l-4 border-primary py-3 px-2 bg-gray-100 w-fit">
        <MdAccountBalanceWallet size={30} />
        <p className=" text-primary rounded-md px-2 text-sm">/ {profile.balance} TRANG</p>
      </div>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid sm:grid-cols-2 grid-cols-1 gap-5 items-start mt-5">
          <div className="space-y-4 overflow-x-scroll">
            <p className="text-md font-bold border-primary pr-2 inline text-primary border-b-4">Phương thức thanh toán</p>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <div className="flex items-center justify-between gap-2 border-2 border-gray-500 rounded-md p-2">
                  <CustomField
                    type="radio"
                    label={method.label}
                    name="method"
                    control={form.control}
                    horizontal
                    labelPosition="after"
                    className="justify-start space-y-0"
                    labelClassName="text-md"
                    key={method.label}
                    placeholder={method.label}
                    radioValue={method.value}
                  />
                  <img src={method.logo} alt={method.label} className="w-10 h-10" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-2">
              <CustomField
                type="number"
                name="amount"
                control={form.control}
                placeholder="Số trang mua"
                label="Tổng số trang"
                horizontal
                max={100}
                className="justify-start space-y-0"
                labelClassName="text-md font-bold text-primary border-primary pr-2 border-b-4"
                inputClassName="max-w-[100px] focus:text-primary font-bold"
              />
              {config && <p className="text-sm text-gray-500">1 trang: {formatCurrency(config.PRICE_PER_A4)}</p>}
            </div>
            {config && (
              <div className="flex items-center gap-3 mt-3">
                <span className="border-2 border-yellow-500 px-2 text-yellow-500 flex items-center gap-2 border-l-4 border-b-4"><TbSum size={30} /> {formatCurrency(config.PRICE_PER_A4 * form.watch("amount"))}</span>
                {width > 640 && <Button type="submit" className="max-w-md" disabled={isPending}>{isPending ? "Đang xử lý..." : "Xác nhận"}</Button>}
              </div>
            )}
            {width <= 640 && <Button type="submit" className="max-w-md mt-5" disabled={isPending}>{isPending ? "Đang xử lý..." : "Xác nhận"}</Button>}
          </div>
        </form>
      </Form>
    </DashboardWrapper>
  )
}

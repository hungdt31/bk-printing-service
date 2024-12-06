import { DashboardWrapper } from "@/components/DashboardWrapper";
import ErrorPage from "@/components/Error";
import { LoadingFullLayout } from "@/components/LoadingFullLayout";
import { ProfileStatisticCard } from "@/components/ProfileStatisticCard";
import { FiPrinter } from 'react-icons/fi'
import { BiMoney } from 'react-icons/bi'
import { useProfile } from "@/hooks/user";
import { useMyStatistic } from "@/hooks/statistic";
import { IoNewspaper } from "react-icons/io5";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { userSchema } from "@/schemas/UserSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaEdit, FaSave } from "react-icons/fa";
import { MdCancel } from 'react-icons/md';
import { updateProfile } from "@/action/user";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import { useRef } from "react";
import { formatDisplayDate } from "@/helpers/format";
import { Badge } from "@/components/ui/badge";

type UserFormValues = z.infer<typeof userSchema>;

export const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const {
    data: profile,
    isError: isErrorProfile,
    isFetching: isFetchingProfile,
    refetch
  } = useProfile();
  const { data: statistic, isError: isErrorStatistic, isFetching: isFetchingStatistic } = useMyStatistic();

  // Hàm helper để format date thành YYYY-MM-DD string
  const formatDateToString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Hàm helper để parse string thành Date object
  const parseDateString = (dateString: string | undefined): Date => {
    if (!dateString) return new Date();
    return new Date(dateString);
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: profile?.username || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      dob: parseDateString(profile?.dob?.toString()),
    },
  });

  const handleCancel = async () => {
    form.reset({
      username: profile?.username || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      dob: parseDateString(profile?.dob?.toString()),
    });
    if (dateInputRef.current) {
      dateInputRef.current.value = formatDateToString(form.getValues("dob"));
    }
    setIsEdit(false);
  };

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    const response = await updateProfile(data);
    if (response.data) {
      await refetch();
      form.reset({
        username: response.data.username,
        email: response.data.email,
        phone: response.data.phone,
        dob: new Date(response.data.dob),
      });
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
    setIsEdit(false);
  };

  if (isFetchingProfile || isFetchingStatistic) {
    return <LoadingFullLayout />;
  }
  if (isErrorProfile || isErrorStatistic) {
    return <ErrorPage />;
  }

  return (
    <DashboardWrapper title="Hồ sơ">
      <div className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
          <ProfileStatisticCard
            title="Tổng đơn in"
            value={Number(statistic?.printOrders.orders.currentMonth) || 0}
            percentageChange={Number(statistic?.printOrders.orders.percentageChange) || 0}
            icon={FiPrinter}
            iconClassName="bg-blue-50 text-blue-500"
          />
          <ProfileStatisticCard
            title="Tổng tiền mua trang in"
            value={Number(statistic?.purchaseOrders.currentMonth) || 0}
            percentageChange={Number(statistic?.purchaseOrders.percentageChange) || 0}
            icon={BiMoney}
            iconClassName="bg-yellow-50 text-yellow-500"
            isCurrency={true}
          />
          <ProfileStatisticCard
            title="Tổng trang sử dụng"
            value={Number(statistic?.printOrders.pages.currentMonth) || 0}
            percentageChange={Number(statistic?.printOrders.pages.percentageChange) || 0}
            icon={IoNewspaper}
            iconClassName="bg-green-50 text-green-500"
          />
        </div>

        <Card className="shadow-md">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-lg font-bold">THÔNG TIN CÁ NHÂN</CardTitle>
                <Badge variant={"secondary"} className="text-sm font-normal">Thành viên từ {formatDisplayDate(new Date(profile?.created_at || new Date()))}</Badge>
              </div>
                {isLoading ? (
                  <PulseLoader color="#3b82f6" size={10} />
                ) : (
                  isEdit ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        type="button"
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <MdCancel className="h-4 w-4" />
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                      >
                        <FaSave className="h-4 w-4" />
                        Lưu
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setIsEdit(true)}
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
                    >
                      <FaEdit className="h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                  )
                )}
            </CardHeader>

            <CardContent className="grid sm:grid-cols-2 grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Họ tên</Label>
                <Input
                  {...form.register("username")}
                  disabled={!isEdit}
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  {...form.register("email")}
                  disabled={!isEdit}
                  type="email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input
                  {...form.register("phone")}
                  disabled={!isEdit}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Ngày sinh</Label>
                <Input
                  // {...form.register("dob")}
                  disabled={!isEdit}
                  type="date"
                  ref={dateInputRef}
                  defaultValue={formatDateToString(form.getValues("dob"))}
                  onChange={(e) => form.setValue("dob", new Date(e.target.value))}
                />
                {/* {form.formState.errors.dob && (
                  <p className="text-sm text-red-500">{form.formState.errors.dob.message}</p>
                )} */}
              </div>
            </CardContent>
            <CardFooter>

            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardWrapper>
  );
};

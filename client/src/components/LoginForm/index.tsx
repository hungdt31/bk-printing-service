import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "../../schemas/AuthSchema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { CardWrapper } from "../CardWrapper";
import CustomField from "@/components/CustomFormField";
import { useNavigate } from "react-router-dom";
import { hanldeLogin } from "@/action/login";
import { toast } from "react-toastify";
import { DEFAULT_DIRECT_AFTER_LOGIN } from "@/utils/path";
import { useProfile } from "@/hooks/useProfile";

export function LoginForm() {
  const { refetch } = useProfile();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setIsPending(true);
    hanldeLogin(values).then(async (result) => {
      if (result.data) {
        await refetch();
        toast.success(result.message);
        navigate(DEFAULT_DIRECT_AFTER_LOGIN);
      } else {
        toast.error(result.message);
      }
      setIsPending(false);
    });
  }
  return (
    <CardWrapper
      title="Đăng nhập"
      description="Chào mừng trở lại."
      backButtonHref="/sign-up"
      backButtonLabel="tại đây"
      backDescription="Chưa có tài khoản? Đăng ký ngay"
      className="w-full max-w-md"
      isLoading={isPending}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CustomField
            control={form.control}
            name="email"
            label="Email"
            placeholder="example@email.com"
            type="email"
            disabled={isPending}
          />
          <CustomField
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
            description="Mật khẩu có độ dài 4 - 16 ký tự"
            type="password"
            disabled={isPending}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Đang đăng nhập..." : "Submit"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpSchema } from "@/schemas/AuthSchema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CardWrapper } from "@/components/CardWrapper";
import CustomField from "@/components/CustomFormField";
import { hanldeSignUp } from "@/action/signup";
import { DEFAULT_DIRECT_AFTER_SIGNUP } from "@/utils/path";

export function SignupForm() {
  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      type: "STUDENT"
    },
  });

  const [isPending, setIsPending] = useState(false);

  function onSubmit(values: z.infer<typeof SignUpSchema>) {
    setIsPending(true);
    hanldeSignUp(values).then(async (result) => {
      if (result.data) {
        toast.success(result.message);
        navigate(DEFAULT_DIRECT_AFTER_SIGNUP);
      } else {
        toast.error(result.message);
      }
      setIsPending(false);
    });
    // console.log(values);
  }
  return (
    <CardWrapper
      title="Đăng ký"
      description="Hãy nhập đầy đủ các thông tin sau đây."
      backButtonHref="/sign-in"
      backButtonLabel="tại đây"
      backDescription="Bạn đã có tài khoản? Đăng nhập ngay"
      className="w-full max-w-md"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex sm:items-start gap-3 flex-col sm:flex-row">
            <CustomField
              control={form.control}
              name="name"
              label="Họ tên"
              placeholder="shadcn"
              type="text"
              disabled={isPending}
            />
            <CustomField
              control={form.control}
              name="type"
              label="Vai trò"
              placeholder="Chọn một vai trò"
              type="select"
              disabled={isPending}
            />
          </div>
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
            Submit
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

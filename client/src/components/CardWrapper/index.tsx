import * as React from "react";
import { cn } from "@/lib/utils";
import {
  CardTitle,
  CardDescription,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  backDescription: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  isLoading?: boolean;
}

const CardWrapper = React.forwardRef<HTMLDivElement, CardWrapperProps>(
  (
    {
      className,
      title,
      description,
      children,
      backButtonLabel,
      backButtonHref,
      backDescription,
      isLoading,
      ...props
    },
    ref,
  ) => {
    return (
      <Card
        className={cn(className)} // Thêm lớp mặc định để tạo kiểu cho Card
        ref={ref}
        {...props}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          {!isLoading && (
            <div className="flex items-center">
              <p className="text-sm">{backDescription}</p>
              <Link to={backButtonHref}>
                <Button variant={"link"}>{backButtonLabel}</Button>
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    );
  },
);

CardWrapper.displayName = "CardWrapper";

export { CardWrapper };

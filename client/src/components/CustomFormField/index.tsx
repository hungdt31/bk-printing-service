import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control, FieldValues, Path } from "react-hook-form"; // Điều chỉnh nếu bạn dùng thư viện form khác
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// CustomField sẽ nhận thêm thuộc tính type cho Control
interface CustomFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  description?: string;
  type?: "email" | "password" | "text" | "textarea" | "select" | "number"; // Các loại bạn muốn
  disabled?: boolean;
  horizontal?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

const CustomField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  disabled,
  horizontal = false,
  options,
  min = 0,
  max = 10
}: CustomFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(horizontal ? "flex items-center gap-2 justify-between" : "")}>
          <FormLabel className={cn(horizontal ? "whitespace-nowrap" : "")}>{label}</FormLabel>
          <FormControl>
            {(() => {
              switch (type) {
                case "email":
                  return (
                    <Input
                      type="email"
                      placeholder={placeholder}
                      {...field}
                      disabled={disabled}
                    />
                  );
                case "password":
                  return (
                    <Input
                      type="password"
                      placeholder={placeholder}
                      {...field}
                      disabled={disabled}
                    />
                  );
                case "textarea":
                  return (
                    <Textarea
                      placeholder={placeholder}
                      {...field}
                      disabled={disabled}
                    />
                  );
                case "select":
                  return (
                    <Select
                      disabled={disabled}
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger className="max-w-[180px]">
                        <SelectValue placeholder={placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                case "number":
                  return (
                    <Input
                      type="number"
                      placeholder={placeholder}
                      {...field}
                      min={min}
                      max={max}
                      className="max-w-[180px]"
                      disabled={disabled}
                    />
                  );
                default:
                  return (
                    <Input
                      type="text"
                      placeholder={placeholder}
                      {...field}
                      disabled={disabled}
                    />
                  );
              }
            })()}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomField;

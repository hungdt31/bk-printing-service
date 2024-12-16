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
  type?: "email" | "password" | "text" | "textarea" | "select" | "number" | "radio" | "date"; // Các loại bạn muốn
  disabled?: boolean;
  horizontal?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  labelPosition?: 'before' | 'after';
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  radioValue?: string;
  defaultValue?: string;
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
  max = 10,
  labelPosition = 'before',
  className = "justify-between",
  labelClassName = "",
  radioValue,
  inputClassName = "",
  step = 0.1,
  defaultValue,
}: CustomFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(
          horizontal ? "flex items-center gap-2" : "",
          className
        )}>
          <FormLabel className={cn(horizontal ? "whitespace-nowrap" : "",
            horizontal && labelPosition === 'after' ? "order-last" : "",
            labelClassName,
          )}>{label}</FormLabel>
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
                      className={inputClassName}
                    />
                  );
                case "password":
                  return (
                    <Input
                      type="password"
                      placeholder={placeholder}
                      {...field}
                      disabled={disabled}
                      className={inputClassName}
                    />
                  );
                case "textarea":
                  return (
                    <Textarea
                      placeholder={placeholder}
                      {...field}
                      disabled={disabled}
                      className={inputClassName}
                    />
                  );
                case "select":
                  return (
                    <Select
                      disabled={disabled}
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger className={cn("max-w-[180px]", inputClassName)}>
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
                      step={step}
                      min={min}
                      max={max}
                      className={
                        cn(
                          inputClassName ? inputClassName : "max-w-[180px]"
                        )
                      }
                      disabled={disabled}
                    />
                  );
                case "radio":
                  return (
                    <Input
                      type="radio"
                      {...field}
                      className="w-4 h-4"
                      placeholder={placeholder}
                      disabled={disabled}
                      value={radioValue}
                      checked={field.value === radioValue}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )
                case "date":
                  return (
                    <Input
                      defaultValue={defaultValue}
                      type="date"
                      placeholder={placeholder}
                      {...field}
                      className={inputClassName}
                      disabled={disabled}
                    />
                  );
                default:
                  return (
                    <Input
                      type="text"
                      placeholder={placeholder}
                      defaultValue={control._defaultValues[name]}
                      {...field}
                      className={inputClassName}
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

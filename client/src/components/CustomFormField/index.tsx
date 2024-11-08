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

// CustomField sẽ nhận thêm thuộc tính type cho Control
interface CustomFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  description?: string;
  type?: "email" | "password" | "text" | "textarea" | "select"; // Các loại bạn muốn
  disabled?: boolean;
}

const CustomField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  disabled,
}: CustomFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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
                      onValueChange={(value) => field.onChange(value)} // Use onValueChange to update react-hook-form
                      value={field.value || "STUDENT"} // Default to "STUDENT" if no value is set
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STUDENT">Sinh viên</SelectItem>
                        <SelectItem value="LECTURER">Cán bộ/ Giảng viên</SelectItem>
                      </SelectContent>
                    </Select>
                  )
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

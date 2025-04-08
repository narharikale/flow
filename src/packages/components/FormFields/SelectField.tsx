import {
  UseFormReturn,
  FieldValues,
  Path,
  ControllerRenderProps,
} from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type Props<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder: string;
  options: Option[];
  defaultValue?: string;
  description?: string;
  readonly?: boolean;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

const SelectField = <TFieldValues extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  options,
  defaultValue,
  description,
  readonly,
  required,
  disabled,
  onChange,
}: Props<TFieldValues>) => {
  const handleChange = (
    field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>,
    value: string
  ) => {
    field.onChange(value);
    onChange?.(value);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label.length > 0 && (
            <FormLabel>
              {label}{" "}
              {required ? <span className="text-destructive">*</span> : null}
            </FormLabel>
          )}
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <Select
            onValueChange={(value) => handleChange(field, value)}
            defaultValue={defaultValue}
            disabled={disabled || readonly}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { SelectField };

import { HTMLInputTypeAttribute } from "react";
import {
  UseFormReturn,
  FieldValues,
  Path,
  ControllerRenderProps,
} from "react-hook-form";

import { cn } from "@/lib/utils";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  defaultValue?: string;
  description?: string;
  readonly?: boolean;
  required?: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};
const InputFormField = <TFieldValues extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type,
  defaultValue,
  description,
  readonly,
  required,
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
        <FormItem className={cn(type === "hidden" && "hidden")}>
          {label.length > 0 && (
            <FormLabel>
              {label}{" "}
              {required ? <span className="text-destructive">*</span> : null}
            </FormLabel>
          )}
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              required={required}
              defaultValue={defaultValue}
              readOnly={readonly}
              {...field}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { InputFormField };

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
import { Checkbox } from "@/components/ui/checkbox";

type Props<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  description?: string;
  readonly?: boolean;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
};

const BooleanField = <TFieldValues extends FieldValues>({
  form,
  name,
  label,
  description,
  readonly,
  required,
  disabled,
  onChange,
}: Props<TFieldValues>) => {
  const handleChange = (
    field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>,
    value: boolean
  ) => {
    field.onChange(value);
    onChange?.(value);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) =>
                handleChange(field, checked as boolean)
              }
              disabled={disabled || readonly}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {label.length > 0 && (
              <FormLabel>
                {label}{" "}
                {required ? <span className="text-destructive">*</span> : null}
              </FormLabel>
            )}
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : null}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { BooleanField };

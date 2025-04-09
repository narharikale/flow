import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  UseFormReturn,
  FieldValues,
  Path,
  ControllerRenderProps,
} from "react-hook-form";

import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (value: Date | undefined) => void;
};

const DateField = <TFieldValues extends FieldValues>({
  form,
  name,
  label,
  placeholder = "MM/DD/YYYY",
  description,
  required = false,
  disabled = false,
  minDate = new Date("1970-01-01"),
  maxDate = new Date(),
  onChange,
}: Props<TFieldValues>) => {
  const handleChange = (
    field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>,
    value: Date | undefined
  ) => {
    field.onChange(value);
    onChange?.(value);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                type="text"
                placeholder={placeholder}
                value={field.value ? format(field.value, "mm/dd/yyyy") : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    handleChange(field, undefined);
                    return;
                  }
                  try {
                    const parsedDate = parse(value, "mm/dd/yyyy", new Date());
                    if (!isNaN(parsedDate.getTime())) {
                      handleChange(field, parsedDate);
                    }
                  } catch {
                    // Invalid date format, keep the input value but don't update the field
                  }
                }}
                disabled={disabled}
                className="pr-10"
              />
            </FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  disabled={disabled}
                >
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => handleChange(field, date)}
                  disabled={(date) => date > maxDate || date < minDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { DateField };

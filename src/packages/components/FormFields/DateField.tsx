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
  onChange?: (value: string | undefined) => void;
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
    value: string | undefined
  ) => {
    field.onChange(value);
    onChange?.(value);
  };

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const parseDate = (dateStr: string) => {
    const [month, day, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
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
                value={field.value}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers and forward slashes
                  if (/^[\d/]*$/.test(value)) {
                    handleChange(field, value);
                  }
                }}
                disabled={disabled}
                className="pr-10 bg-white text-stone-950"
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
                  <CalendarIcon className="h-4 w-4 text-stone-950" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? parseDate(field.value) : undefined}
                  onSelect={(date) =>
                    handleChange(field, date ? formatDate(date) : undefined)
                  }
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

import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Field } from "@/packages/utils/types";
import { InputFormField } from "./TextField";
import { DateField } from "./DateField";
import { SelectField } from "./SelectField";
import { BooleanField } from "./BooleanField";

type Props<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  field: Field;
};

const FieldRenderer = <TFieldValues extends FieldValues>({
  form,
  field,
}: Props<TFieldValues>) => {
  const commonProps = {
    form,
    name: field.key as Path<TFieldValues>,
    label: field.title,
    placeholder: field.placeholder,
    description: field.tooltip,
    required: field.required,
    disabled: field.disabled,
  };

  switch (field.interface.type) {
    case "text":
      return (
        <InputFormField
          {...commonProps}
          type="text"
          defaultValue={field.defaultValue}
        />
      );
    case "date":
      return <DateField {...commonProps} />;
    case "select":
      return (
        <SelectField
          {...commonProps}
          options={
            field.interface.options?.map((option: string) => ({
              label: option,
              value: option,
            })) || []
          }
          defaultValue={field.defaultValue}
        />
      );
    case "boolean":
      return <BooleanField {...commonProps} />;
    default:
      return (
        <InputFormField
          {...commonProps}
          type="text"
          defaultValue={field.defaultValue}
        />
      );
  }
};

export { FieldRenderer };

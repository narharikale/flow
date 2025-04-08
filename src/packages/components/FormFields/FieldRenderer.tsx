import { UseFormReturn, Path } from "react-hook-form";
import { InputFormField } from "./TextField";
import { DateField } from "./DateField";
import { SelectField } from "./SelectField";
import { BooleanField } from "./BooleanField";
import { Field } from "@/packages/utils/types";
import { FormValues } from "@/packages/utils/schema";

type Props = {
  form: UseFormReturn<FormValues>;
  field: Field;
  fieldKey: string;
  sectionKey: string;
};

const FieldRenderer = ({ form, field, fieldKey, sectionKey }: Props) => {
  const commonProps = {
    form,
    name: `sections.${sectionKey}.fields.${fieldKey}.value` as Path<FormValues>,
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

import { useState } from "react";

import { Form } from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { FormData, Field } from "@/packages/utils/types";

import { cn } from "@/lib/utils";
import { FieldRenderer } from "@/packages/components/FormFields/FieldRenderer";

function useDntelForm(initialData: FormData, id?: string) {
  const [editMode, setEditMode] = useState(false);

  //   const form = useForm<FormSchema>({
  //     resolver: zodResolver(formSchema),
  //     defaultValues,
  //   });

  //   const handleSubmit: SubmitHandler<FormSchema> = (values) => {
  //     console.log(values, "va;ues");
  //   };

  const DntelForm = () => {
    return (
      <Form {...form}>
        <form
          id={id}
          //onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-2 gap-8 "
        >
          {Object.values(initialData.sections).map((section, index) => (
            <Accordion
              type="single"
              key={section.title + index}
              collapsible
              style={{ backgroundColor: section.bgColor }}
              className={cn(
                "p-4 rounded-sm text-primary w-full h-fit",
                `order-${section.order}`,
                section.layout === "full" ? "col-span-2" : "col-span-1"
              )}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className=" font-500 ">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-5">
                  {Object.values(section.fields).map((field: Field) => {
                    return (
                      <div
                        key={field.key}
                        className={`${
                          field.colSpan === "2" ? "col-span-2" : "col-span-1"
                        }`}
                      >
                        <FieldRenderer form={form} field={field} />
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </form>
      </Form>
    );
  };

  return {
    editMode,
    setEditMode,
    DntelForm,
  };
}

export { useDntelForm };

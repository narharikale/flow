import { useState, useCallback, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import { FieldRenderer } from "@/packages/components/FormFields/FieldRenderer";
import { SubmitHandler, useForm } from "react-hook-form";
import { formSchema, FormValues } from "../utils/schema";

function useDntelForm(initialData: FormValues, id?: string) {
  const [editMode, setEditMode] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleSubmit = useCallback<SubmitHandler<FormValues>>((values) => {
    console.log(values, "values");
  }, []);

  const sections = useMemo(
    () => Object.entries(initialData.sections),
    [initialData.sections]
  );

  const DntelForm = useCallback(
    () => (
      <Form {...form}>
        <form
          id={id}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(handleSubmit)(e);
          }}
          className="grid grid-cols-2 gap-8"
        >
          <button type="submit">SubmitHandler</button>
          {sections.map((section, index) => (
            <Accordion
              type="single"
              key={section[1].title + index}
              collapsible
              value={activeAccordion || undefined}
              onValueChange={setActiveAccordion}
              style={{ backgroundColor: section[1].bgColor }}
              className={cn(
                "p-4 rounded-sm text-primary w-full h-fit",
                `order-${section[1].order}`,
                section[1].layout === "full" ? "col-span-2" : "col-span-1"
              )}
            >
              <AccordionItem value={`section-${index}`}>
                <AccordionTrigger className="font-500">
                  {section[1].title}
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-5">
                  {Object.entries(section[1].fields).map((field) => (
                    <div
                      key={field[1].key}
                      className={`${
                        field[1].colSpan === "2" ? "col-span-2" : "col-span-1"
                      }`}
                    >
                      <FieldRenderer
                        form={form}
                        field={field[1]}
                        fieldKey={field[0]}
                        sectionKey={section[0]}
                      />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </form>
      </Form>
    ),
    [form, id, handleSubmit, sections, activeAccordion]
  );

  return {
    editMode,
    setEditMode,
    DntelForm,
  };
}

export { useDntelForm };

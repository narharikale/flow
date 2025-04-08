import { useState, useCallback, useMemo, useEffect } from "react";

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
  const [editMode, setEditMode] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [lastChangeTimestamp, setLastChangeTimestamp] = useState<number | null>(
    null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const subscription = form.watch((_, { type }) => {
      if (type === "change") {
        setLastChangeTimestamp(Date.now());
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = useCallback<SubmitHandler<FormValues>>((values) => {
    console.log(values, "values");
  }, []);

  const sections = useMemo(
    () => Object.entries(initialData.sections),
    [initialData.sections]
  );

  const expandAll = useCallback(() => {
    const allSectionIds = sections.map((_, index) => `section-${index}`);
    setExpandedSections(allSectionIds);
  }, [sections]);

  const collapseAll = useCallback(() => {
    setExpandedSections([]);
  }, []);

  const expandSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      if (prev.includes(sectionId)) {
        return prev;
      }
      return [...prev, sectionId];
    });
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

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
          {sections.map((section, index) => (
            <Accordion
              type="multiple"
              key={section[1].title + index}
              id={`section-${index}`}
              value={expandedSections}
              onValueChange={setExpandedSections}
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
                        disabled={!editMode}
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
    [form, id, handleSubmit, sections, expandedSections, editMode]
  );

  return {
    editMode,
    setEditMode,
    DntelForm,
    expandedSections,
    setExpandedSections,
    lastChangeTimestamp,
    expandAll,
    collapseAll,
    expandSection,
    scrollToSection,
  };
}

export { useDntelForm };

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
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [lastChangeTimestamp, setLastChangeTimestamp] = useState<number | null>(
    null
  );
  const [formChanges, setFormChanges] = useState<Record<string, unknown>>({});

  const getDraft = useCallback(() => {
    if (!id) return null;
    const draft = localStorage.getItem(`dntel-form-draft-${id}`);
    return draft ? JSON.parse(draft) : null;
  }, [id]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDraft() || initialData,
  });

  useEffect(() => {
    if (!id) return;

    const subscription = form.watch((values, { type, name }) => {
      if (type === "change" && name) {
        setLastChangeTimestamp(Date.now());
        const currentValue = form.getValues(name as keyof FormValues);
        setFormChanges((prev) => ({
          ...prev,
          [name]: currentValue,
        }));
        localStorage.setItem(`dntel-form-draft-${id}`, JSON.stringify(values));
      }
    });

    return () => subscription.unsubscribe();
  }, [form, id]);

  useEffect(() => {
    return () => {
      if (id) {
        localStorage.removeItem(`dntel-form-draft-${id}`);
      }
    };
  }, [id]);

  const handleSubmit = useCallback<SubmitHandler<FormValues>>(
    (values) => {
      console.log(values, "values");
      if (id) {
        localStorage.removeItem(`dntel-form-draft-${id}`);
      }
    },
    [id]
  );

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

  const clearLs = useCallback(() => {
    if (id) {
      localStorage.removeItem(`dntel-form-draft-${id}`);
    }
  }, [id]);

  const changeValue = useCallback(
    (key: string, value: string) => {
      const [sectionKey, fieldKey] = key.split(".");
      form.setValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `sections.${sectionKey}.fields.${fieldKey}.value` as any,
        value,
        {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        }
      );
    },
    [form]
  );

  const reset = useCallback(() => {
    form.reset(initialData);
    setExpandedSections([]);
    setLastChangeTimestamp(null);
    clearLs();
  }, [form, initialData, clearLs]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            expandedSections.includes(entry.target.id)
          ) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(([_, section]) => {
      const element = document.getElementById(`section-${section.order}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections, expandedSections]);

  return {
    editMode,
    setEditMode,
    DntelForm,
    expandedSections,
    setExpandedSections,
    lastChangeTimestamp,
    formChanges,
    expandAll,
    collapseAll,
    expandSection,
    scrollToSection,
    clearLs,
    reset,
    changeValue,
    activeSection,
  };
}

export { useDntelForm };

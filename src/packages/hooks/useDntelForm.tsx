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
import { useForm } from "react-hook-form";
import { formSchema, FormValues } from "../utils/schema";

function useDntelForm(initialData: FormValues, id?: string) {
  const [editMode, setEditMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [lastChangeTimestamp, setLastChangeTimestamp] = useState<number | null>(
    null
  );
  const [changes, setFormChanges] = useState<Record<string, unknown>>({});

  const sections = useMemo(
    () => Object.entries(initialData.sections),
    [initialData.sections]
  );

  const getDraft = useCallback(() => {
    if (!id) return null;
    const key = `dntel-form-draft-${id}`;
    const draft = localStorage.getItem(key);
    return draft ? JSON.parse(draft) : null;
  }, [id]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDraft() || initialData,
  });

  // get initial data
  useEffect(() => {
    if (!id) return;
    const key = `dntel-form-draft-${id}`;
    const draft = localStorage.getItem(key);
    if (draft) {
      form.reset(JSON.parse(draft));
    } else {
      form.reset(initialData);
    }
  }, [id, form, initialData]);

  const clearLs = useCallback(() => {
    if (id) {
      localStorage.removeItem(`dntel-form-draft-${id}`);
    }
  }, [id]);

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

  const expandAll = useCallback(() => {
    const allSectionIds = sections.map((section) => section[0]);
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

  const changeValue = useCallback(
    (key: string, value: string | Date | boolean) => {
      const [sectionKey, fieldKey] = key.split(".");
      const field = form.getValues(`sections.${sectionKey}.fields.${fieldKey}`);

      let convertedValue = value;
      if (field?.interface?.type === "date" && typeof value === "string") {
        convertedValue = new Date(value);
      } else if (
        field?.interface?.type === "boolean" &&
        typeof value === "string"
      ) {
        convertedValue = value === "true";
      }

      form.setValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `sections.${sectionKey}.fields.${fieldKey}.value` as any,
        convertedValue
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
            form.handleSubmit(clearLs)(e);
          }}
          className="grid grid-cols-2 gap-8"
        >
          {sections.map((section, index) => (
            <Accordion
              type="multiple"
              key={section[1].title + index}
              id={section[0]}
              value={expandedSections}
              onValueChange={(value) => {
                setExpandedSections(value);
              }}
              style={{
                backgroundColor: section[1].bgColor,
                order: section[1].order,
              }}
              className={cn(
                "p-4 rounded-sm text-primary w-full h-fit",
                section[1].layout === "full" ? "col-span-2" : "col-span-1"
              )}
            >
              <AccordionItem value={section[0]}>
                <AccordionTrigger className="font-500 text-lg ">
                  {section[1].title}{" "}
                  {`(${section[1].stats.filled}/${section[1].stats.total})`}
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-5 p-1">
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
    [form, id, clearLs, sections, expandedSections, editMode]
  );

  // to get visible & expanded section
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

    sections.forEach(([section]) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections, expandedSections]);

  return {
    form,
    DntelForm,
    sections,
    editMode,
    setEditMode,
    expandAll,
    collapseAll,
    expandSection,
    scrollToSection,
    reset,
    activeSection,
    setActiveSection,
    lastChangeTimestamp,
    changes,
    changeValue,
    handleSubmit: form.handleSubmit,
    clearLs,
  };
}

export { useDntelForm };

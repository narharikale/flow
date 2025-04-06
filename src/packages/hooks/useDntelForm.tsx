import { useState } from "react";

type InputData = {
  section: string[];
};

type DntelFormProps = {
  className?: string;
};

function useDntelForm(initialData: InputData, id?: string) {
  const [editMode, setEditMode] = useState(false);

  console.log(initialData, id);

  return {
    editMode,
    setEditMode,
  };
}

const DntelForm = ({ className = "" }: DntelFormProps) => {
  return <form className={className}> {}</form>;
};

export { useDntelForm, DntelForm };

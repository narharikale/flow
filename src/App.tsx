import "./App.css";
import { useDntelForm, DntelForm } from "./packages/hooks/useDntelForm";

function App() {
  const { editMode } = useDntelForm({ section: ["noe"] }, "123");

  console.log(editMode, "state");

  return (
    <>
      <DntelForm />
    </>
  );
}

export default App;

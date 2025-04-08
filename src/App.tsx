import "./App.css";
import { useDntelForm } from "./packages/hooks/useDntelForm";
import inputData from "./lib/inputData.json";

function App() {
  const { DntelForm, scrollToSection } = useDntelForm(inputData, "test");

  return (
    <>
      <button onClick={() => scrollToSection("section-4")}> scroll</button>
      <DntelForm />
    </>
  );
}

export default App;

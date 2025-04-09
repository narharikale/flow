import "./App.css";
import inputData from "./lib/inputData.json";

function App() {
  const { DntelForm } = useDntelForm(inputData, "test");

  return (
    <>
      <DntelForm />
    </>
  );
}

export default App;

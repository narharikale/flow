import "./App.css";
import { useDntelForm } from "./packages/hooks/useDntelForm";
import inputData from "./lib/inputData.json";

function App() {
  const { DntelForm, changeValue } = useDntelForm(inputData, "test");

  return (
    <>
      <button
        onClick={() =>
          changeValue(
            "VerificationInformation.InsuranceRepresentativeName",
            "test"
          )
        }
      >
        click
      </button>
      <DntelForm />
    </>
  );
}

export default App;

import "./App.css";
import inputData from "./lib/inputData.json";
import useDentalForm from "dntel-form";
import {
  Edit,
  Eye,
  Expand,
  Minus,
  RotateCcw,
  Send,
  Clock,
  FileText,
} from "lucide-react";

function App() {
  const {
    DntelForm,
    editMode,
    setEditMode,
    expandAll,
    collapseAll,
    reset,
    activeSection,
    lastChangeTimestamp,

    handleSubmit,
  } = useDentalForm(inputData, "test");

  const handleFormSubmit = (data: Record<string, unknown>) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="">
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end h-16 items-center gap-3">
            <div className="flex gap-2">
              <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 border border-gray-100 flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">
                  Active: {activeSection || "No Section"}
                </span>
              </div>
              <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 border border-gray-100 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">
                  {lastChangeTimestamp
                    ? new Date(lastChangeTimestamp).toLocaleTimeString()
                    : "No changes"}
                </span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-3 py-2 rounded-md text-sm font-medium bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                {editMode ? (
                  <>
                    <Eye className="w-4 h-4" />
                    View Mode
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Edit Mode
                  </>
                )}
              </button>
              <button
                onClick={expandAll}
                className="px-3 py-2 rounded-md text-sm font-medium bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Expand className="w-4 h-4" />
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-2 rounded-md text-sm font-medium bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Minus className="w-4 h-4" />
                Collapse All
              </button>
              <button
                onClick={reset}
                className="px-3 py-2 rounded-md text-sm font-medium bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Form
              </button>
            </div>
            <button
              onClick={() => handleSubmit(handleFormSubmit)}
              className="px-4 py-2 rounded-md text-sm font-medium bg-stone-900 text-green-500 border  shadow-sm flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Form
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <DntelForm />
        </div>
      </main>
    </div>
  );
}

export default App;

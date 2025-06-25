
import { Image as ImageIcon, FileText } from "lucide-react";
import { GenerateMode } from "./useGodModeGenerate";

interface GodModeModeSelectorProps {
  mode: GenerateMode;
  setMode: (mode: GenerateMode) => void;
}

const GENERATE_MODES = [
  { key: "adcopy", label: "Ad Copy", description: "Best model for text" },
  { key: "image", label: "Image", description: "4o model (image generation)" }
] as const;

export function GodModeModeSelector({ mode, setMode }: GodModeModeSelectorProps) {
  return (
    <div className="flex justify-center gap-4 mb-5">
      {GENERATE_MODES.map((m) => (
        <button
          type="button"
          key={m.key}
          onClick={() => setMode(m.key)}
          className={`flex items-center px-6 py-2 rounded-full border transition-all text-base font-semibold gap-2
            ${
              mode === m.key
                ? "bg-emerald-600 text-white border-emerald-700 shadow"
                : "bg-white text-gray-700 border-gray-200 hover:bg-emerald-50"
            }
          `}
          aria-pressed={mode === m.key}
        >
          {m.key === "image" ? (
            <ImageIcon className="h-5 w-5" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
          {m.label}
        </button>
      ))}
    </div>
  );
}

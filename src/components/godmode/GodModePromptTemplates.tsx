
import React from "react";
import { GenerateMode } from "./useGodModeGenerate";

const PROMPT_TEMPLATES = [
  {
    mode: "adcopy",
    template: "10 TikTok hooks for fitness wear UGC"
  },
  {
    mode: "adcopy",
    template: "Write headlines for a Black Friday ad campaign for a coffee brand"
  },
  {
    mode: "image",
    template: "A happy golden retriever in Times Square, photorealistic, 4k"
  },
  {
    mode: "image",
    template: "Ultra-realistic product shot of a glass bottle of cold brew coffee on a marble countertop, with soft morning sunlight"
  }
] as const;

interface GodModePromptTemplatesProps {
  mode: GenerateMode;
  setPrompt: (prompt: string) => void;
}

export function GodModePromptTemplates({ mode, setPrompt }: GodModePromptTemplatesProps) {
  return (
    <div className="mb-3 flex flex-wrap gap-2 justify-center">
      {PROMPT_TEMPLATES.filter(t => t.mode === mode).map((t, idx) => (
        <button
          key={idx}
          type="button"
          className="px-3 py-1.5 bg-gray-100 rounded-full border text-sm hover:bg-emerald-100"
          onClick={() => setPrompt(t.template)}
        >
          {t.template}
        </button>
      ))}
    </div>
  );
}

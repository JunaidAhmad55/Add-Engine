
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useGodModeGenerate } from "./useGodModeGenerate";
import { GodModeModeSelector } from "./GodModeModeSelector";
import { GodModePromptTemplates } from "./GodModePromptTemplates";
import { GodModeResultView } from "./GodModeResultView";

const GodModeOverlay: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  // Org and user stubs (pull from storage/session)
  const org_id = window.localStorage.getItem("org_id") || "demo-org-id";
  const user_id = window.localStorage.getItem("user_id") || "demo-user-id";

  const {
    mode,
    setMode,
    prompt,
    setPrompt,
    loading,
    result,
    resultType,
    error,
    handleGenerate,
    handleReset,
  } = useGodModeGenerate({ org_id, user_id });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <span className="text-xl font-bold text-gray-800">God Mode</span>
          </div>
        </div>
        {/* Mode Selector */}
        <GodModeModeSelector mode={mode} setMode={setMode} />
        {/* Prompt Templates */}
        <GodModePromptTemplates mode={mode} setPrompt={setPrompt} />

        {/* Result or form */}
        {!result && (
          <div className="py-4 text-center">
            <p className="text-lg font-semibold mb-2">AI-Assisted Creativity</p>
            <p className="text-gray-600 mb-4">
              {mode === "image"
                ? "Generate images using state-of-the-art AI. Type your prompt and get tailored visuals (gpt-4o)."
                : "Generate ad copy, headlines, and marketing ideas with best-in-class AI models (gpt-4o or latest)."}
            </p>
            <textarea
              className="border w-full p-3 rounded mb-4"
              placeholder={
                mode === "image"
                  ? "e.g. “A happy golden retriever in Times Square, photorealistic, 4k”"
                  : "e.g. “10 TikTok hooks for fitness wear UGC”"
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={loading}
            ></textarea>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate {mode === "image" ? "Image" : "Ad Copy"}
            </Button>
            {error && <div className="text-red-600 mt-3 text-sm">{error}</div>}
          </div>
        )}

        {/* Result output */}
        {result && (
          <GodModeResultView
            result={result}
            resultType={resultType}
            onBack={handleReset}
            org_id={org_id}
            user_id={user_id}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GodModeOverlay;

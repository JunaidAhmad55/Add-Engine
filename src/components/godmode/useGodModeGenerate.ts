
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type GenerateMode = "adcopy" | "image";
export type GodModeResultType = "image" | "text" | null;

export function useGodModeGenerate({
  org_id,
  user_id,
}: {
  org_id: string;
  user_id: string;
}) {
  const [mode, setMode] = useState<GenerateMode>("adcopy");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultType, setResultType] = useState<GodModeResultType>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const resp = await fetch("/functions/v1/god-mode-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode, org_id, user_id }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        setError(data.error || "Generation error");
        setLoading(false);
        return;
      }
      setResult(data.result);
      setResultType(data.event_type === "image" ? "image" : "text");
      toast({
        title: "AI Generation Success",
        description: data.event_type === "image"
          ? "Image generated!"
          : "Copy generated!",
      });
    } catch (e: any) {
      setError(e.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setResult(null);
    setResultType(null);
    setError(null);
  };

  return {
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
    setResult,
    setResultType,
  };
}


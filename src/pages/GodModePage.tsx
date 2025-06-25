import React, { useState } from "react";
import GodModeOverlay from "@/components/godmode/GodModeOverlay";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const GodModePage: React.FC = () => {
  const [overlayOpen, setOverlayOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
        <Sparkles className="h-7 w-7 text-emerald-500" />
        AI God Mode
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Unlock AI-powered tools for asset and copy generation, plus creative prompt templates. Coming soon: voice ideas, direct asset injections, and team-wide controls!
      </p>
      <Button
        variant="default"
        size="lg"
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => setOverlayOpen(true)}
      >
        <Sparkles className="h-5 w-5 mr-2" /> Launch God Mode
      </Button>
      <GodModeOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
      {/* More features and help to come */}
    </div>
  );
};

export default GodModePage;

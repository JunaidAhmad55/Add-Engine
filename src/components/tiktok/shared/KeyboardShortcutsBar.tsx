
import React from "react";

interface KeyboardShortcutsBarProps {
  searchLabel?: string;
}

const KeyboardShortcutsBar: React.FC<KeyboardShortcutsBarProps> = ({ 
  searchLabel = "Search" 
}) => (
  <div className="w-full flex items-center gap-6 text-xs px-2 py-1 bg-blue-50 border border-blue-100 rounded mb-2">
    <span className="font-medium text-blue-500">Keyboard Shortcuts:</span>
    <span><b>/</b> – {searchLabel}</span>
    <span><b>Esc</b> – Close form</span>
    <span><b>Ctrl+Enter</b> – Submit form</span>
  </div>
);

export default KeyboardShortcutsBar;

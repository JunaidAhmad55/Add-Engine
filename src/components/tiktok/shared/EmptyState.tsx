
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center py-6 text-gray-400 gap-2 bg-white rounded border mt-2">
      <Icon className="w-8 h-8 mb-1" />
      <div className="font-semibold">{title}</div>
      {description && <div className="text-sm text-gray-400 mt-1">{description}</div>}
      <Button size="sm" variant="outline" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyState;


import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export interface MockDocContent {
  name: string;
  headline: string;
  primaryText: string;
}

const mockDocs: MockDocContent[] = [
  {
    name: "Q3 Campaign Brief.gdoc",
    headline: "🚀 Launching Our New Q3 Collection!",
    primaryText: "Discover the latest trends and styles in our new Q3 collection. Perfect for every occasion.",
  },
  {
    name: "Summer Sale Copy Ideas.gdoc",
    headline: "☀️ Summer Sale Extravaganza!",
    primaryText: "Don't miss out on our hottest deals of the summer. Up to 50% off on selected items.",
  },
  {
    name: "Product Launch Announcement.gdoc",
    headline: "✨ Introducing the Future of [Your Product Category]",
    primaryText: "Experience innovation like never before. Pre-order yours today and be among the first to own it.",
  },
];

interface GoogleDocsPickerProps {
  onDocSelected: (docContent: MockDocContent) => void;
  onClose: () => void;
}

const GoogleDocsPicker: React.FC<GoogleDocsPickerProps> = ({ onDocSelected, onClose }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select a mock document to import its content.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {mockDocs.map((doc) => (
          <Card key={doc.name} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50 p-4">
              <CardTitle className="text-sm font-medium truncate">{doc.name}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs font-semibold truncate text-gray-800">{doc.headline}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.primaryText}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => {
                  onDocSelected(doc);
                  onClose(); 
                }}
              >
                Select & Import
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default GoogleDocsPicker;

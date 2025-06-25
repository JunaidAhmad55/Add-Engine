
import React from "react";

interface AIRAssetComment {
  author: string;
  text: string;
  date: string;
}

interface AIRAssetCommentsProps {
  assetId: string;
}

const mockComments: Record<string, AIRAssetComment[]> = {
  "air-asset-1": [
    {
      author: "Mona",
      text: "Can we brighten this photo slightly?",
      date: "2024-06-10"
    },
    {
      author: "Jake",
      text: "Logo placement looks great.",
      date: "2024-06-11"
    }
  ],
  "air-asset-2": [
    {
      author: "Alex",
      text: "Video cuts are super smooth! Approved.",
      date: "2024-06-12"
    }
  ],
  "air-asset-3": [
    {
      author: "Sam",
      text: "Do we have a higher-res version of this asset?",
      date: "2024-06-13"
    }
  ]
};

const AIRAssetComments: React.FC<AIRAssetCommentsProps> = ({ assetId }) => {
  const comments = mockComments[assetId] || [];

  if (comments.length === 0) {
    return <div className="bg-muted/50 rounded p-2 text-xs text-gray-500">No comments yet for this asset.</div>;
  }

  return (
    <div className="space-y-2 mt-1 text-xs">
      {comments.map((c, i) => (
        <div key={i} className="rounded bg-gray-50 p-2 border border-gray-200">
          <div className="font-medium text-gray-700">{c.author} <span className="text-gray-400">({c.date})</span></div>
          <div className="mt-1">{c.text}</div>
        </div>
      ))}
    </div>
  );
};

export default AIRAssetComments;

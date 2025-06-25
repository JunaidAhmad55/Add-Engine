
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface ActivityLogRowProps {
  log: any;
  isAdmin: boolean;
  editingId: string | null;
  editVal: string;
  saving: boolean;
  setEditingId: (id: string | null) => void;
  setEditVal: (value: string) => void;
  handleSaveComment: (id: string) => Promise<void>;
  getUserDisplay: (user: any, user_id?: string) => string;
}

const ActivityLogRow = ({
  log,
  isAdmin,
  editingId,
  editVal,
  saving,
  setEditingId,
  setEditVal,
  handleSaveComment,
  getUserDisplay,
}: ActivityLogRowProps) => {
  return (
    <tr key={log.id}>
      <td className="font-medium">{new Date(log.created_at).toLocaleString()}</td>
      <td>{getUserDisplay(log.user, log.user_id)}</td>
      <td>{log.action}</td>
      <td>{JSON.stringify(log.details)}</td>
      <td>
        {isAdmin ? (
          editingId === log.id ? (
            <div className="flex items-center gap-2">
              <input
                className="border px-2 py-1 w-36 rounded text-xs"
                value={editVal}
                disabled={saving}
                onChange={e => setEditVal(e.target.value)}
              />
              <Button
                size="sm"
                disabled={saving}
                onClick={() => handleSaveComment(log.id)}
                className="text-green-700 border-green-300 hover:bg-green-100 px-2 py-1"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingId(null)}
                className="px-2 py-1"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center gap-2 group">
              <span className="text-xs text-gray-700">
                {log.comment || <span className="text-gray-400 italic">No comment</span>}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditingId(log.id);
                  setEditVal(log.comment || "");
                }}
                className="px-2 py-1 opacity-0 group-hover:opacity-100 transition"
              >
                Edit
              </Button>
            </div>
          )
        ) : (
          <span className="text-xs text-gray-700">
            {log.comment || <span className="text-gray-400 italic">No comment</span>}
          </span>
        )}
      </td>
    </tr>
  );
};

export default ActivityLogRow;

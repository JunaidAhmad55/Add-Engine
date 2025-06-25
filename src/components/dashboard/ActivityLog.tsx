import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ActivityLogRow from "./ActivityLogRow";
import { logsToCsv } from "./activity-log-csv";

// You may want to pass in isAdmin from parent, here we'll assume admin if localStorage 'userRole' is "admin".
// Replace with your app's actual method of checking admin rights.
const isAdmin = ((): boolean => {
  try {
    const userRole = window.localStorage?.getItem('userRole');
    return userRole === 'admin';
  } catch { return false; }
})();

const getUserDisplay = (user: any, user_id?: string) => {
  if (!user) return user_id || "";
  if (user.full_name) return user.full_name;
  if (user.email) return user.email;
  return user_id || "";
};

interface ActivityLogProps {
  logs: any[];
  loading: boolean;
}

const ActivityLog = ({ logs, loading }: ActivityLogProps) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadingJson, setDownloadingJson] = useState(false); // New for JSON
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Trigger browser download
  function handleDownload() {
    setDownloading(true);
    const csv = logsToCsv(logs, getUserDisplay);
    // Make a blob and trigger download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity_log_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    setDownloading(false);
  }

  // NEW: JSON download handler
  function handleDownloadJson() {
    setDownloadingJson(true);
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity_log_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    setDownloadingJson(false);
  }

  async function handleSaveComment(id: string) {
    setSaving(true);
    const { error } = await supabase
      .from('activity_log')
      .update({ comment: editVal })
      .eq('id', id);

    setSaving(false);
    setEditingId(null);
    if (error) {
      toast({
        title: "Failed to update comment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Comment saved",
        description: "Audit comment was successfully updated.",
      });
      window.location.reload();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Activity Log</h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={loading || downloading}
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Exporting..." : "Download CSV"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={loading || downloadingJson}
            onClick={handleDownloadJson}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {downloadingJson ? "Exporting..." : "Download JSON"}
          </Button>
        </div>
      </div>
      <Table>
        <TableCaption>A list of recent activities on your account.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Audit Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No activity logs found.</TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <ActivityLogRow
                key={log.id}
                log={log}
                isAdmin={isAdmin}
                editingId={editingId}
                editVal={editVal}
                saving={saving}
                setEditingId={setEditingId}
                setEditVal={setEditVal}
                handleSaveComment={handleSaveComment}
                getUserDisplay={getUserDisplay}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityLog;

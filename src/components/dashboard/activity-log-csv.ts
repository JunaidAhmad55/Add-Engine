
export function logsToCsv(logs: any[], getUserDisplay: (user: any, user_id?: string) => string) {
  if (!logs?.length) return "";
  const headers = ["Date", "User", "Action", "Details", "Comment"];
  const csvRows = [
    headers.join(","),
    ...logs.map((log) =>
      [
        `"${new Date(log.created_at).toLocaleString()}"`,
        `"${getUserDisplay(log.user, log.user_id)}"`,
        `"${log.action}"`,
        `"${JSON.stringify(log.details) || ""}"`,
        `"${log.comment ? log.comment.replace(/"/g, '""') : ''}"`,
      ].join(",")
    ),
  ];
  return csvRows.join("\n");
}

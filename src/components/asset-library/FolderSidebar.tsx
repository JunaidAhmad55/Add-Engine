
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder } from "lucide-react";

interface Folder {
  id: string;
  name: string;
  count: number;
}

interface FolderSidebarProps {
  folders: Folder[];
  selectedFolder: string;
  onFolderSelect: (folderId: string) => void;
}

const FolderSidebar = ({ folders, selectedFolder, onFolderSelect }: FolderSidebarProps) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Folder className="h-5 w-5" />
          Folders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onFolderSelect(folder.id)}
            className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
              selectedFolder === folder.id 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="font-medium">{folder.name}</span>
            <span className="text-sm text-gray-500">{folder.count}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default FolderSidebar;

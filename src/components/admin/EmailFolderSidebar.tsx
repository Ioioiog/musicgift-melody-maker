
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EMAIL_FOLDERS, useEmailFolderCounts } from "@/hooks/useEmailAccounts";
import { cn } from "@/lib/utils";

interface EmailFolderSidebarProps {
  accountId: string | null;
  selectedFolder: string;
  onFolderSelect: (folder: string) => void;
}

const EmailFolderSidebar = ({ 
  accountId, 
  selectedFolder, 
  onFolderSelect 
}: EmailFolderSidebarProps) => {
  const { data: folderCounts = {} } = useEmailFolderCounts(accountId);

  return (
    <div className="w-64 border-r bg-gray-50/50">
      <div className="p-4 border-b">
        <h3 className="font-medium text-gray-900">Folders</h3>
      </div>
      
      <ScrollArea className="h-96">
        <div className="p-2 space-y-1">
          {EMAIL_FOLDERS.map((folder) => {
            const counts = folderCounts[folder.id];
            const isSelected = selectedFolder === folder.id;
            
            return (
              <Button
                key={folder.id}
                variant={isSelected ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isSelected && "bg-purple-100 text-purple-900 hover:bg-purple-200"
                )}
                onClick={() => onFolderSelect(folder.id)}
              >
                <span className="text-lg">{folder.icon}</span>
                <span className="flex-1 text-left">{folder.name}</span>
                
                {counts && (
                  <div className="flex gap-1">
                    {counts.unread > 0 && folder.id !== 'Sent' && (
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5"
                      >
                        {counts.unread}
                      </Badge>
                    )}
                    {counts.total > 0 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs px-1.5 py-0.5"
                      >
                        {counts.total}
                      </Badge>
                    )}
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EmailFolderSidebar;


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TeamMember {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
}

interface TeamMemberListItemProps {
  member: TeamMember;
  currentUserRole: string;
  currentUserEmail?: string;
  onRoleChange?: (memberId: string, newRole: string) => void;
  onRemoveMember?: (memberId: string) => void;
}

const ROLE_LABELS = [
  { value: "admin", label: "Admin" },
  { value: "buyer", label: "Buyer" },
  { value: "creator", label: "Creator" },
  { value: "user", label: "User" },
];

const TeamMemberListItem = ({
  member,
  currentUserRole,
  currentUserEmail,
  onRoleChange,
  onRemoveMember,
}: TeamMemberListItemProps) => {
  const [changing, setChanging] = useState(false);

  // Don't allow admin to remove themselves or change their own role here
  const isCurrentUser = member.email === currentUserEmail;

  return (
    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={member.avatar_url || undefined} alt={member.full_name || 'avatar'} />
          <AvatarFallback>
            {member.full_name?.split(' ').map(n => n[0]).join('') || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{member.full_name}</p>
          <p className="text-sm text-gray-500">{member.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {currentUserRole === 'admin' && !isCurrentUser ? (
          <>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={member.role ?? ""}
              disabled={changing}
              onChange={e => {
                setChanging(true);
                onRoleChange && onRoleChange(member.id, e.target.value);
                setTimeout(() => setChanging(false), 500); // avoid double-call
              }}
              style={{ minWidth: 95 }}
            >
              {ROLE_LABELS.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              disabled={changing}
              onClick={() => {
                setChanging(true);
                onRemoveMember && onRemoveMember(member.id);
                setTimeout(() => setChanging(false), 500);
              }}
              className="text-red-600 border-red-300 hover:bg-red-100"
            >
              Remove
            </Button>
          </>
        ) : (
          <Badge variant="secondary" className="capitalize">
            {member.role}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default TeamMemberListItem;


import TeamMemberListItem from "./TeamMemberListItem";

interface TeamMember {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
}

interface TeamMemberListProps {
  members: TeamMember[];
  currentUserRole: string;
  currentUserEmail?: string;
  onRoleChange?: (memberId: string, newRole: string) => void;
  onRemoveMember?: (memberId: string) => void;
}

const TeamMemberList = ({
  members,
  currentUserRole,
  currentUserEmail,
  onRoleChange,
  onRemoveMember,
}: TeamMemberListProps) => {
  return (
    <>
      {members.map((member) => (
        <TeamMemberListItem
          key={member.id}
          member={member}
          currentUserRole={currentUserRole}
          currentUserEmail={currentUserEmail}
          onRoleChange={onRoleChange}
          onRemoveMember={onRemoveMember}
        />
      ))}
    </>
  );
};

export default TeamMemberList;

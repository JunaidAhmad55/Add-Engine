
const TeamEmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center">
            <p className="font-semibold">Your team is empty</p>
            <p className="text-sm text-gray-500 mt-1">Invite your first team member to get started.</p>
        </div>
    );
};

export default TeamEmptyState;

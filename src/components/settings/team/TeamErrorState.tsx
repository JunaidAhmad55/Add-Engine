
const TeamErrorState = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center">
            <p className="font-semibold text-red-600">Error Loading Team</p>
            <p className="text-sm text-gray-500 mt-1">We couldn't fetch your team members. Please try again later.</p>
        </div>
    );
};

export default TeamErrorState;

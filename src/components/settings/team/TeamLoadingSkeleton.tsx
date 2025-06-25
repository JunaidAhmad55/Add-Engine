
import { Skeleton } from "@/components/ui/skeleton";

const TeamLoadingSkeleton = () => {
    return (
        <>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                </div>
            ))}
        </>
    );
};

export default TeamLoadingSkeleton;

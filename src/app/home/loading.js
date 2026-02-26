import SkeletonLoader from "@/components/SkeletonLoader";

export default function Loading() {
    return (
        <div className="min-h-screen">
            <div className="mb-10 text-center">
                <div className="h-10 md:h-14 bg-gray-200 dark:bg-gray-800 rounded-xl w-3/4 max-w-2xl mx-auto mb-4 shimmer"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2 max-w-sm mx-auto mb-6 shimmer"></div>
                <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-full w-full max-w-3xl mx-auto mb-6 shimmer"></div>
            </div>
            <SkeletonLoader />
        </div>
    );
}

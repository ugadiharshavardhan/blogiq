export default function SkeletonLoader() {
    return (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, index) => (
                <div
                    key={index}
                    className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300"
                >
                    {/* Image Skeleton */}
                    <div className="h-56 w-full shimmer"></div>

                    <div className="p-5 space-y-4">
                        {/* Title */}
                        <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-3/4 shimmer"></div>

                        {/* Lines */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded shimmer"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 shimmer"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 shimmer"></div>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-3 pt-3">
                            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full shimmer"></div>
                            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full shimmer"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

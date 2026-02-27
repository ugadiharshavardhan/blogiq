import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import AdminInteractiveArea from "@/components/AdminInteractiveArea";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { checkRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in?redirect_url=/admin");
    }

    const isAdmin = await checkRole("admin");

    if (!isAdmin) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center">
                <h1 className="text-3xl font-black text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-500">You must be an administrator to view this page.</p>
            </div>
        );
    }

    await connectDB();

    try {
        const clerk = await clerkClient();
        const totalUsers = await clerk.users.getCount();
        const userList = await clerk.users.getUserList({ limit: 100 });
        const pendingCreators = userList.data
            .filter(user => user.publicMetadata?.creatorStatus === "pending")
            .map(user => ({
                id: user.id,
                email: user.emailAddresses[0]?.emailAddress || "No Email",
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                createdAt: user.createdAt
            }));

        const [totalBlogs, pendingBlogs, approvedBlogs, rejectedBlogs, allBlogs] = await Promise.all([
            Blog.countDocuments(),
            Blog.countDocuments({ status: "pending" }),
            Blog.countDocuments({ status: "approved" }),
            Blog.countDocuments({ status: "rejected" }),
            Blog.find().sort({ createdAt: -1 }).lean(),
        ]);
        const serializedBlogs = allBlogs.map(b => ({
            ...b,
            _id: b._id.toString()
        }));

        const metrics = {
            users: totalUsers,
            totalBlogs,
            pending: pendingBlogs,
            approved: approvedBlogs,
            rejected: rejectedBlogs,
            pendingCreatorsCount: pendingCreators.length
        };

        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors pb-20">
                <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800 mb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/home" className="flex items-center gap-3 group">
                                <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center p-0.5 transition-transform duration-300 group-hover:scale-105">
                                    <img
                                        src="/icon.png"
                                        alt="BlogIQ"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                <span className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    Blog<span className="text-indigo-600 dark:text-indigo-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">IQ</span>
                                </span>
                            </Link>
                            <div className="flex items-center gap-4">
                                <ThemeToggle />
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{ elements: { avatarBox: "w-9 h-9 md:w-10 md:h-10 ring-2 ring-indigo-500/20 rounded-full" } }}
                                />
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <header className="mb-10">
                        <h1 className="text-4xl font-black tracking-tight mb-2 text-indigo-900 dark:text-indigo-400">Admin Control Center</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Platform Metrics & Moderation Queue</p>
                    </header>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">
                        {[
                            { label: "Total Users", value: metrics.users, color: "text-blue-600 dark:text-blue-400" },
                            { label: "Total Blogs", value: metrics.totalBlogs, color: "text-indigo-600 dark:text-indigo-400" },
                            { label: "Applications", value: metrics.pendingCreatorsCount || 0, color: "text-purple-600 dark:text-purple-400" },
                            { label: "Pending", value: metrics.pending, color: "text-yellow-600 dark:text-yellow-400" },
                            { label: "Approved", value: metrics.approved, color: "text-green-600 dark:text-green-400" },
                            { label: "Rejected", value: metrics.rejected, color: "text-red-600 dark:text-red-400" },
                        ].map((metric, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 line-clamp-1">{metric.label}</span>
                                <span className={`text-3xl lg:text-4xl font-black ${metric.color}`}>{metric.value}</span>
                            </div>
                        ))}
                    </div>

                    <AdminInteractiveArea blogs={serializedBlogs} pendingCreators={pendingCreators} />
                </div>
            </div>
        );
    } catch (err) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center">
                <h1 className="text-3xl font-black text-red-600 mb-4">Dashboard Error</h1>
                <p className="text-gray-500">{err.message}</p>
            </div>
        );
    }
}

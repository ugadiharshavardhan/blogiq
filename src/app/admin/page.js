import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import AdminDashboardClient from "@/components/AdminDashboardClient";
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
            <AdminDashboardClient metrics={metrics} blogs={serializedBlogs} pendingCreators={pendingCreators} />
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

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";
import Link from "next/link";

import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic"; // Ensure fresh data on every load

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in?redirect_url=/dashboard");
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    await connectDB();
    const dbUser = await User.findOne({ clerkId: userId });

    const role = dbUser?.role || user?.publicMetadata?.role || "user";
    const creatorStatus = dbUser?.creatorStatus || user?.publicMetadata?.creatorStatus || "none";
    if (role !== "admin" && (role !== "creator" || creatorStatus !== "active")) {
        async function applyForCreator() {
            "use server";
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");

            const { clerkClient } = await import('@clerk/nextjs/server');
            const client = await clerkClient();

            await client.users.updateUser(userId, {
                publicMetadata: {
                    role: "user",
                    creatorStatus: "pending"
                }
            });

            const user = await client.users.getUser(userId);

            await connectDB();
            await User.findOneAndUpdate(
                { clerkId: userId },
                {
                    $set: {
                        clerkId: userId,
                        email: user.emailAddresses[0]?.emailAddress || "",
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        role: "user",
                        creatorStatus: "pending"
                    }
                },
                { upsert: true, new: true }
            );

            redirect("/dashboard");
        }

        return (
            <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto text-center">
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100 dark:border-gray-800">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-7a4 4 0 11-8 0 4 4 0 018 0zm-4-3V4m0 0v2m0-2h2m-2 0H6m14 11V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2v-4z" />
                    </svg>
                </div>

                {creatorStatus === "pending" ? (
                    <>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Application Under Review</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                            Thank you for your interest! An administrator is currently reviewing your request to join the Creator program. We will notify you once a decision has been made.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Creator Access Required</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                            Your account is currently standard. You must apply for and be granted Creator access by an administrator before you can publish articles to the global feed.
                        </p>
                        {creatorStatus === "rejected" && (
                            <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-bold">
                                Your previous application was denied or your access was revoked.
                            </div>
                        )}
                        <form action={applyForCreator} className="mb-4">
                            <button type="submit" className="inline-block px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 uppercase tracking-widest text-sm">
                                Apply for Access
                            </button>
                        </form>
                    </>
                )}

                <Link href="/home" className="inline-block px-8 py-3 text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold transition mt-4">
                    Back to Library
                </Link>
            </div>
        );
    }
    await connectDB();
    const blogs = await Blog.find({ authorId: userId }).sort({ createdAt: -1 });

    return <DashboardClient initialBlogs={JSON.parse(JSON.stringify(blogs))} />;
}

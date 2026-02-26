import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import EditBlogForm from "@/components/EditBlogForm";

export default async function EditBlogPage({ params }) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect("/sign-in?redirect_url=/dashboard");
    }

    const { id } = await params;

    // Fetch directly from DB
    await connectDB();
    const blog = await Blog.findById(id).lean();

    if (!blog) {
        return notFound();
    }

    const role = user.publicMetadata?.role || "user";
    if (blog.authorId !== userId && role !== "admin") {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center">
                <h1 className="text-3xl font-black text-red-600 mb-4">Forbidden</h1>
                <p>You do not have permission to edit this blog.</p>
            </div>
        );
    }

    // Serialize object ids
    const serializedBlog = {
        ...blog,
        _id: blog._id.toString(),
        createdAt: blog.createdAt?.toISOString(),
        updatedAt: blog.updatedAt?.toISOString()
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Edit Story</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">Revise and resubmit your work.</p>
                    </div>
                    <Link href="/dashboard" className="text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Cancel
                    </Link>
                </header>

                <EditBlogForm blog={serializedBlog} />
            </div>
        </div>
    );
}

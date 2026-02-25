"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search } from "lucide-react";

function StatusBadge({ status }) {
    const styles = {
        pending: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
        approved: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    };

    const labels = {
        pending: "🟡 Pending",
        approved: "🟢 Approved",
        rejected: "🔴 Rejected",
    };

    return (
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${styles[status]}`}>
            {labels[status] || status}
        </span>
    );
}

export default function DashboardClient({ initialBlogs }) {
    const router = useRouter();
    const [blogs, setBlogs] = useState(initialBlogs);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedBlogForView, setSelectedBlogForView] = useState(null);
    const [blogToDelete, setBlogToDelete] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchTerm);
    };

    const filteredBlogs = blogs.filter(blog => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            blog.title?.toLowerCase().includes(query) ||
            blog.category?.toLowerCase().includes(query) ||
            blog.excerpt?.toLowerCase().includes(query)
        );
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDelete = (blog) => {
        setBlogToDelete(blog);
    };

    const confirmDelete = async () => {
        if (!blogToDelete) return;
        setIsDeleting(blogToDelete._id);
        try {
            const res = await fetch(`/api/blogs/${blogToDelete._id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete blog");
            }

            setBlogs(blogs.filter(b => b._id !== blogToDelete._id));
            router.refresh();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsDeleting(null);
            setBlogToDelete(null);
        }
    };

    const handleViewPublic = (blog) => {
        setSelectedBlogForView(blog);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors">
            {/* Navbar */}
            <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/home" className="flex items-center gap-3 group">
                            <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center p-0.5 transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src="/logo.png"
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

            <div className="max-w-6xl mx-auto pt-12 pb-20 px-4 md:px-8 lg:px-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Creator Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your editorial publications.</p>
                    </div>
                    <Link href="/dashboard/create" className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-xl hover:-translate-y-1 transition transform flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Write Story
                    </Link>
                </header>

                <form onSubmit={handleSearch} className="mb-8 flex gap-3 max-w-xl">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search your articles by title or category..."
                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition transition-colors"
                    />
                    <button type="submit" className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95">
                        <Search className="w-5 h-5" />
                        <span className="hidden sm:inline">Search</span>
                    </button>
                </form>

                {filteredBlogs.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                        {searchQuery ? (
                            <>
                                <p className="text-xl font-bold text-gray-400 mb-2">No articles found matching "{searchQuery}".</p>
                                <button onClick={() => { setSearchTerm(''); setSearchQuery(''); }} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Clear search filter →</button>
                            </>
                        ) : (
                            <>
                                <p className="text-xl font-bold text-gray-400 mb-4">You haven't written anything yet.</p>
                                <Link href="/dashboard/create" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Start your first draft →</Link>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredBlogs.map((blog) => (
                            <div key={blog._id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <StatusBadge status={blog.status} />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            {isMounted ? new Date(blog.createdAt).toLocaleDateString() : new Date(blog.createdAt).toISOString().split('T')[0]}
                                        </span>
                                        <span className="text-xs font-bold text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md uppercase tracking-wider">{blog.category || "Uncategorized"}</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{blog.title}</h2>
                                    <p className="text-gray-500 dark:text-gray-400 line-clamp-1">{blog.excerpt || "No excerpt provided."}</p>

                                    {blog.status === "rejected" && blog.rejectionReason && (
                                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-sm text-red-700 dark:text-red-400">
                                            <strong>Rejection Reason:</strong> {blog.rejectionReason}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                                    {blog.status === "approved" && (
                                        <button onClick={() => handleViewPublic(blog)} className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                            View Public
                                        </button>
                                    )}
                                    <Link href={`/dashboard/edit/${blog._id}`} className="px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog)}
                                        disabled={isDeleting === blog._id}
                                        className="px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition disabled:opacity-50"
                                    >
                                        {isDeleting === blog._id ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {
                selectedBlogForView && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm z-[100]">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
                            <button
                                onClick={() => setSelectedBlogForView(null)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="p-8 md:p-12">
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{selectedBlogForView.category || "Editorial"}</span>
                                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mt-2 mb-6 leading-tight">
                                    {selectedBlogForView.title}
                                </h1>

                                {selectedBlogForView.coverImage && (
                                    <div className="aspect-[21/10] bg-gray-50 dark:bg-gray-900/50 overflow-hidden rounded-xl mb-8">
                                        <img
                                            src={selectedBlogForView.coverImage}
                                            alt={selectedBlogForView.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div
                                    className="prose prose-lg dark:prose-invert max-w-none font-serif editorial-body"
                                    dangerouslySetInnerHTML={{ __html: selectedBlogForView.content }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            {blogToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-gray-100 dark:border-gray-800 animate-fade-in-up text-center">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Delete Article?</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Are you sure you want to delete <strong>"{blogToDelete.title}"</strong>?<br />This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setBlogToDelete(null)}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl font-bold transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting === blogToDelete._id}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 transition disabled:opacity-50"
                            >
                                {isDeleting === blogToDelete._id ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

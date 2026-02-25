"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import Link from "next/link";
import { use } from "react";

export default function EditBlogPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [category, setCategory] = useState("technology");
    const [excerpt, setExcerpt] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [content, setContent] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/blogs/${params.id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch blog");
                }

                const blog = data.blog;
                setTitle(blog.title || "");
                setSlug(blog.slug || "");
                setCategory(blog.category || "technology");
                setExcerpt(blog.excerpt || "");
                setCoverImage(blog.coverImage || "");
                setContent(blog.content || "");
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchBlog();
        }
    }, [params.id]);

    const handleTitleChange = (e) => {
        const val = e.target.value;
        setTitle(val);
        setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        if (!title || !slug || !content || content === "<p></p>" || !category) {
            setError("Title, slug, category, and content are required.");
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch(`/api/blogs/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, slug, category, excerpt, coverImage, content }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update blog");
            }
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 text-center">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-500 font-bold">Loading your draft...</p>
            </div>
        );
    }

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

                {error && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium rounded-xl">
                        {error}
                    </div>
                )}

                <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 font-medium rounded-xl text-sm">
                    <strong>Note:</strong> Saving changes will automatically reset this post's status to <strong>Pending</strong>. It will require administrator approval to appear on the public feed.
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6 bg-gray-50 dark:bg-gray-900/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                placeholder="The greatest story ever told..."
                                className="w-full px-5 py-3 md:text-xl font-bold rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Slug</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="the-greatest-story"
                                className="w-full px-4 py-2 text-sm font-mono rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                required
                            >
                                <option value="business">Business</option>
                                <option value="technology">Technology</option>
                                <option value="sports">Sports</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="health">Health</option>
                                <option value="science">Science</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Excerpt (Optional)</label>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="A brief summary of your article..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">Cover Image URL (Optional)</label>
                            <input
                                type="url"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-4">Content</label>
                        <RichTextEditor content={content} onChange={setContent} />
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-black rounded-xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                "Update & Submit for Review"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

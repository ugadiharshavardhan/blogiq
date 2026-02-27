"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { approveBlogAction, rejectBlogAction, setCreatorRoleAction } from "@/app/admin/actions";

export default function AdminInteractiveArea({ blogs, pendingCreators = [] }) {
    const [activeTab, setActiveTab] = useState("pending");
    const [processingId, setProcessingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [revokeCreator, setRevokeCreator] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [viewingBlog, setViewingBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [optimisticStatuses, setOptimisticStatuses] = useState({});
    const [hiddenUsers, setHiddenUsers] = useState(new Set());

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchTerm);
    };

    const filteredBlogs = blogs.filter(b => {
        const currentStatus = optimisticStatuses[b._id] || b.status;
        if (currentStatus !== activeTab) return false;
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        return (
            (b.title && b.title.toLowerCase().includes(query)) ||
            (b.category && b.category.toLowerCase().includes(query)) ||
            (b.excerpt && b.excerpt.toLowerCase().includes(query))
        );
    });

    const handleApprove = async (blogId) => {
        setProcessingId(blogId);
        try {
            await approveBlogAction(blogId);
            setOptimisticStatuses(prev => ({ ...prev, [blogId]: "approved" }));
        } catch (e) {
            alert("Failed to approve blog");
        } finally {
            setProcessingId(null);
        }
    };

    const openRejectModal = (blog) => {
        setSelectedBlog(blog);
        setRejectionReason("");
        setRevokeCreator(false);
        setIsModalOpen(true);
    };

    const handleRejectSubmit = async () => {
        if (!selectedBlog) return;
        setProcessingId(selectedBlog._id);
        setIsModalOpen(false);

        try {
            await rejectBlogAction(selectedBlog._id, rejectionReason, revokeCreator, selectedBlog.authorId, selectedBlog.authorName);
            setOptimisticStatuses(prev => ({ ...prev, [selectedBlog._id]: "rejected" }));
            setSelectedBlog(null);
        } catch (e) {
            alert("Failed to reject blog");
        } finally {
            setProcessingId(null);
            setSelectedBlog(null);
        }
    };

    const handleCreatorAction = async (userId, action) => {
        setProcessingId(userId);
        try {
            await setCreatorRoleAction(userId, action);
            setHiddenUsers(prev => new Set(prev).add(userId));
        } catch (e) {
            alert(`Failed to ${action} user`);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div>
            <div className="flex space-x-2 mb-6 p-1 bg-gray-200 dark:bg-gray-900 rounded-xl w-full max-w-full overflow-x-auto snap-x hide-scrollbar">
                {[
                    { id: "apps", label: "Creator Apps" },
                    { id: "pending", label: "Pending Blogs" },
                    { id: "approved", label: "Approved Blogs" },
                    { id: "rejected", label: "Rejected Blogs" }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 md:px-6 py-2 rounded-lg font-bold text-xs md:text-sm tracking-wide capitalize transition-all whitespace-nowrap snap-start ${activeTab === tab.id
                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSearch} className="mb-6 flex gap-3 max-w-xl">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, category, or excerpt..."
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition transition-colors"
                />
                <button type="submit" className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95">
                    <Search className="w-5 h-5" />
                    <span className="hidden sm:inline">Search</span>
                </button>
            </form>

            <div className="space-y-4">
                {activeTab === "apps" && pendingCreators.filter(u => !hiddenUsers.has(u.id)).length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                        <p className="text-gray-400 font-bold text-lg">No pending creator applications.</p>
                    </div>
                )}
                {activeTab === "apps" && pendingCreators.filter(u => !hiddenUsers.has(u.id)).map((user) => (
                    <div key={user.id} className="bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                {user.imageUrl ? (
                                    <img src={user.imageUrl} className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700" alt={user.firstName} />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                                )}
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                                    <p className="text-xs text-gray-400 mt-1" suppressHydrationWarning>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <button
                                    onClick={() => handleCreatorAction(user.id, "upgrade")}
                                    disabled={processingId === user.id}
                                    className="px-6 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 rounded-lg font-bold text-sm transition text-center whitespace-nowrap"
                                >
                                    {processingId === user.id ? "Processing..." : "Approve Creator"}
                                </button>
                                <button
                                    onClick={() => handleCreatorAction(user.id, "reject_application")}
                                    disabled={processingId === user.id}
                                    className="px-6 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg font-bold text-sm transition text-center"
                                >
                                    Deny Request
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {activeTab !== "apps" && filteredBlogs.length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                        {searchQuery ? (
                            <>
                                <p className="text-gray-400 font-bold text-lg mb-2">No {activeTab} blogs found matching "{searchQuery}".</p>
                                <button onClick={() => { setSearchTerm(''); setSearchQuery(''); }} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Clear search filter →</button>
                            </>
                        ) : (
                            <p className="text-gray-400 font-bold text-lg">No {activeTab} blogs found.</p>
                        )}
                    </div>
                )}
                {activeTab !== "apps" && filteredBlogs.map((blog) => (
                    <div key={blog._id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">{blog.title}</h3>
                                    <button
                                        onClick={() => setViewingBlog(blog)}
                                        className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition"
                                        title="View full content"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium" suppressHydrationWarning>
                                    By <span className="text-indigo-600 dark:text-indigo-400">{blog.authorName}</span> • {new Date(blog.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {activeTab === "pending" && (
                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    <button
                                        onClick={() => handleApprove(blog._id)}
                                        disabled={processingId === blog._id}
                                        className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-lg font-bold text-sm transition"
                                    >
                                        {processingId === blog._id ? "Processing..." : "Approve"}
                                    </button>
                                    <button
                                        onClick={() => openRejectModal(blog)}
                                        disabled={processingId === blog._id}
                                        className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg font-bold text-sm transition"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {viewingBlog && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="flex-none p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{viewingBlog.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2" suppressHydrationWarning>
                                    By <span className="text-indigo-600 dark:text-indigo-400">{viewingBlog.authorName}</span> • {new Date(viewingBlog.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setViewingBlog(null)}
                                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                            <div className="prose prose-lg dark:prose-invert prose-indigo max-w-none">
                                {viewingBlog.coverImage && (
                                    <img src={viewingBlog.coverImage} alt="Cover" className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-8" />
                                )}
                                <div dangerouslySetInnerHTML={{ __html: viewingBlog.content }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Reject Content</h2>
                        <p className="text-gray-500 text-sm mb-6">You are rejecting <strong>"{selectedBlog?.title}"</strong> by {selectedBlog?.authorName}.</p>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Reason (Optional)</label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Violates community guidelines."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none"
                            />
                        </div>

                        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={revokeCreator}
                                    onChange={(e) => setRevokeCreator(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-red-600 rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                />
                                <div>
                                    <span className="block font-bold text-red-900 dark:text-red-400">Revoke Creator Privileges</span>
                                    <span className="block text-xs text-red-700 dark:text-red-400/80 mt-1">If this is a severe 18+ violation, revoke their dashboard access permanently. Their standard account will remain.</span>
                                </div>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

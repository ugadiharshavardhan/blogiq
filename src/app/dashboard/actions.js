"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function createBlogAction(data) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return { success: false, error: "Unauthorized" };
        }

        const role = user.publicMetadata?.role || "user";
        const creatorStatus = user.publicMetadata?.creatorStatus || "none";

        if (role !== "admin" && (role !== "creator" || creatorStatus !== "active")) {
            return { success: false, error: "Forbidden: You must be an active creator to post." };
        }

        const { title, slug, content, excerpt, coverImage, category } = data;

        if (!title || !slug || !content || !category) {
            return { success: false, error: "Missing required fields" };
        }

        await connectDB();
        const existing = await Blog.findOne({ slug });
        if (existing) {
            return { success: false, error: "Slug already exists. Please choose another." };
        }

        const newBlog = await Blog.create({
            title,
            slug,
            category,
            content,
            excerpt,
            coverImage,
            authorId: userId,
            authorName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.firstName || "Unknown"),
            status: "pending",
        });

        // Revalidate the dashboard page so the new pending blog appears
        revalidatePath("/dashboard");

        return { success: true, blogId: newBlog._id.toString() };
    } catch (error) {
        console.error("Failed to create blog action:", error);
        return { success: false, error: "Failed to create blog. " + error.message };
    }
}

export async function updateBlogAction(id, data) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return { success: false, error: "Unauthorized" };
        }

        const role = user.publicMetadata?.role || "user";
        const creatorStatus = user.publicMetadata?.creatorStatus || "none";

        if (role !== "admin" && (role !== "creator" || creatorStatus !== "active")) {
            return { success: false, error: "Forbidden: You must be an active creator to edit." };
        }

        const { title, slug, content, excerpt, coverImage, category } = data;

        if (!title || !slug || !content || !category) {
            return { success: false, error: "Missing required fields" };
        }

        await connectDB();

        // Find existing to ensure they own it (unless admin)
        const existingBlog = await Blog.findById(id);
        if (!existingBlog) {
            return { success: false, error: "Blog not found" };
        }

        if (existingBlog.authorId !== userId && role !== "admin") {
            return { success: false, error: "Forbidden: You do not own this blog" };
        }

        // Check if new slug conflicts with another blog
        const slugConflict = await Blog.findOne({ slug, _id: { $ne: id } });
        if (slugConflict) {
            return { success: false, error: "Slug already exists. Please choose another." };
        }

        const updateData = {
            title,
            slug,
            category,
            content,
            excerpt,
            coverImage,
            status: "pending",
            rejectionReason: null, // Clear any previous rejection reasons
        };

        await Blog.findByIdAndUpdate(id, updateData);

        // Revalidate the dashboard and the details page
        revalidatePath("/dashboard");
        revalidatePath(`/blog/${slug}/details/${id}`);

        return { success: true };
    } catch (error) {
        console.error("Failed to update blog action:", error);
        return { success: false, error: "Failed to update blog. " + error.message };
    }
}

import { auth } from "@clerk/nextjs/server";
import { checkRole, checkCreatorStatus } from "@/lib/roles";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import {
    sendBrevoEmail,
    getBlogAcceptanceTemplate,
    getBlogRejectionTemplate
} from "@/lib/sendEmail";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const resolvedParams = await params;
        const blogId = resolvedParams.id;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        const { userId } = await auth();
        const isAdmin = await checkRole("admin");
        if (blog.status !== "approved" && !isAdmin && String(blog.authorId) !== String(userId)) {
            return NextResponse.json({ error: "Unauthorized access to this blog" }, { status: 403 });
        }

        return NextResponse.json({ blog });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blog", details: error.message }, { status: 500 });
    }
}
export async function PUT(req, { params }) {
    try {
        const { userId } = await auth();
        const isAdmin = await checkRole("admin");
        const isCreator = await checkCreatorStatus();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const resolvedParams = await params;
        const blogId = resolvedParams.id;
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        const body = await req.json();
        if (isAdmin && body.action === "moderate") {
            if (!["approved", "rejected"].includes(body.status)) {
                return NextResponse.json({ error: "Invalid status" }, { status: 400 });
            }

            blog.status = body.status;
            if (body.status === "rejected") {
                blog.rejectionReason = body.rejectionReason || "Violation of platform guidelines.";
            } else {
                blog.rejectionReason = null;
            }

            await blog.save();

            // Try to notify the creator about the decision
            try {
                const clerk = await clerkClient();
                const authorUser = await clerk.users.getUser(blog.authorId);
                const authorEmail = authorUser.emailAddresses[0]?.emailAddress;
                const authorName = authorUser.firstName || "Creator";

                if (authorEmail) {
                    if (body.status === "approved") {
                        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://next-blog-app-iota.vercel.app";
                        const articleUrl = `${appUrl}/blog/${blog.slug}/details/${blog._id}`;
                        await sendBrevoEmail(
                            authorEmail,
                            authorName,
                            "Your blog post has been approved!",
                            getBlogAcceptanceTemplate(authorName, blog.title, articleUrl)
                        );
                    } else if (body.status === "rejected") {
                        await sendBrevoEmail(
                            authorEmail,
                            authorName,
                            "Update on your BlogIQ submission",
                            getBlogRejectionTemplate(authorName, blog.title, blog.rejectionReason)
                        );
                    }
                }
            } catch (emailError) {
                console.error("Failed to send moderation email to author:", emailError);
            }

            return NextResponse.json({ message: `Blog ${body.status} successfully`, blog });
        }
        if (isAdmin || (isCreator && String(blog.authorId) === String(userId))) {
            if (body.title) blog.title = body.title;
            if (body.slug) blog.slug = body.slug;
            if (body.content) blog.content = body.content;
            if (body.excerpt !== undefined) blog.excerpt = body.excerpt;
            if (body.coverImage !== undefined) blog.coverImage = body.coverImage;
            // Every creator edit resets it to pending review
            blog.status = "pending";
            blog.rejectionReason = null;

            await blog.save();
            return NextResponse.json({ message: "Blog updated successfully", blog });
        }

        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update blog", details: error.message }, { status: 500 });
    }
}
export async function DELETE(req, { params }) {
    try {
        const { userId } = await auth();
        const isAdmin = await checkRole("admin");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const resolvedParams = await params;
        const blogId = resolvedParams.id;
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }
        if (!isAdmin && String(blog.authorId) !== String(userId)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await Blog.findByIdAndDelete(blogId);
        return NextResponse.json({ message: "Blog deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete blog", details: error.message }, { status: 500 });
    }
}

import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter"); // "all", "mine", "public"

        const { userId } = await auth();
        const user = await currentUser();
        const role = user?.publicMetadata?.role || "user";

        let query = { status: "approved" };

        if (filter === "all" && role === "admin") {
            query = {}; // Admin sees everything
        } else if (filter === "mine" && (role === "creator" || role === "admin") && userId) {
            query = { authorId: userId }; // Creators see their own (pending, approved, rejected)
        }

        const blogs = await Blog.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ blogs });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blogs", details: error.message }, { status: 500 });
    }
}
export async function POST(req) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        const role = user?.publicMetadata?.role || "user";
        const creatorStatus = user?.publicMetadata?.creatorStatus || "none";

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (role !== "admin" && (role !== "creator" || creatorStatus !== "active")) {
            return NextResponse.json({ error: "Forbidden: You must be an active creator to post." }, { status: 403 });
        }

        const body = await req.json();
        const { title, slug, content, excerpt, coverImage, category } = body;

        if (!title || !slug || !content || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDB();
        const existing = await Blog.findOne({ slug });
        if (existing) {
            return NextResponse.json({ error: "Slug already exists. Please choose another." }, { status: 400 });
        }

        const newBlog = await Blog.create({
            title,
            slug,
            category,
            content,
            excerpt,
            coverImage,
            authorId: userId,
            authorName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : (user?.firstName || "Unknown"),
            status: "pending", // All new blogs default to pending
        });

        return NextResponse.json({ message: "Blog created successfully", blog: newBlog }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create blog", details: error.message }, { status: 500 });
    }
}

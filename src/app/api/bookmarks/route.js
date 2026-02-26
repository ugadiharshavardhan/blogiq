import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 });

        return Response.json(bookmarks);
    } catch (error) {
        return Response.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const blog = await request.json();
        if (!blog || !blog.id) {
            return Response.json({ error: "Invalid blog data" }, { status: 400 });
        }

        await connectDB();

        const existingBookmark = await Bookmark.findOne({ userId, blogId: blog.id });

        if (existingBookmark) {
            await Bookmark.deleteOne({ _id: existingBookmark._id });
            return Response.json({ message: "Bookmark removed", isBookmarked: false });
        } else {
            const newBookmark = new Bookmark({
                userId,
                blogId: blog.id,
                title: blog.title,
                description: blog.description,
                content: blog.content,
                isInternal: blog.isInternal,
                fromCreator: blog.fromCreator,
                url: blog.url,
                urlToImage: blog.urlToImage,
                category: blog.category,
                publishedAt: blog.publishedAt,
                author: blog.author,
                source: blog.source,
            });

            await newBookmark.save();
            return Response.json({ message: "Bookmark added", isBookmarked: true });
        }
    } catch (error) {
        return Response.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}

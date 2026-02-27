import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
import BookmarksInteractiveArea from "@/components/BookmarksInteractiveArea";


async function fetchUserBookmarks() {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        await connectDB();

        
        const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 }).lean();

        return bookmarks.map(b => ({
            ...b,
            _id: b._id.toString()
        }));
    } catch (error) {
        console.error("Failed to fetch bookmarks server-side:", error);
        return [];
    }
}

export default async function BookmarksPage() {
    const initialBookmarks = await fetchUserBookmarks();

    return (
        <BookmarksInteractiveArea initialBookmarks={initialBookmarks} />
    );
}

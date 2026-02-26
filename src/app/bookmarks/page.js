import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
import BookmarksInteractiveArea from "@/components/BookmarksInteractiveArea";

// Function to fetch bookmarks securely on the server direct from MongoDB
async function fetchUserBookmarks() {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        await connectDB();

        // Fetch bookmarks from MongoDB and sort by newest
        const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 }).lean();

        // Serialize ObjectIds to strings to pass to Client Component safely
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

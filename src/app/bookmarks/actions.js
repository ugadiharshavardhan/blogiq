"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";

export async function removeBookmarkAction(blogId) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    await connectDB();
    await Bookmark.findOneAndDelete({ userId, blogId });

    revalidatePath("/bookmarks");
}

import { auth, clerkClient } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function checkRole(roleToCheck) {
    const { userId } = await auth();
    if (!userId) return false;

    await connectDB();
    const dbUser = await User.findOne({ clerkId: userId });

    if (dbUser && dbUser.role) {
        return dbUser.role === roleToCheck;
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user?.publicMetadata?.role === roleToCheck;
}

export async function getRole() {
    const { userId } = await auth();
    if (!userId) return "user";

    await connectDB();
    const dbUser = await User.findOne({ clerkId: userId });

    if (dbUser && dbUser.role) {
        return dbUser.role;
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user?.publicMetadata?.role || "user";
}

export async function checkCreatorStatus() {
    const { userId } = await auth();
    if (!userId) return false;

    await connectDB();
    const dbUser = await User.findOne({ clerkId: userId });

    if (dbUser && dbUser.creatorStatus) {
        return dbUser.creatorStatus === "active";
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user?.publicMetadata?.creatorStatus === "active";
}

"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { checkRole } from "@/lib/roles";
import {
    sendBrevoEmail,
    getCreatorAcceptanceTemplate,
    getCreatorRejectionTemplate,
    getBlogAcceptanceTemplate,
    getBlogRejectionTemplate
} from "@/lib/sendEmail";
export async function approveBlogAction(blogId) {
    const isAdmin = await checkRole("admin");
    if (!isAdmin) throw new Error("Unauthorized");

    await connectDB();
    const blog = await Blog.findByIdAndUpdate(blogId, { status: "approved" }, { new: true });

    // Notify Creator
    if (blog && blog.authorId) {
        try {
            const client = await clerkClient();
            const authorUser = await client.users.getUser(blog.authorId);
            const authorEmail = authorUser.emailAddresses[0]?.emailAddress;
            const authorName = authorUser.firstName || "Creator";

            if (authorEmail) {
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://next-blog-app-iota.vercel.app";
                const articleUrl = `${appUrl}/blog/${blog.slug}/details/${blog._id}`;

                await sendBrevoEmail(
                    authorEmail,
                    authorName,
                    "Your blog post has been approved!",
                    getBlogAcceptanceTemplate(authorName, blog.title, articleUrl)
                );
            }
        } catch (e) {
            console.error("Failed to send approval email:", e);
        }
    }

    revalidatePath("/admin");
    revalidatePath("/home");
}

export async function rejectBlogAction(blogId, rejectionReason, revokeCreator, authorId, authorName) {
    const isAdmin = await checkRole("admin");
    if (!isAdmin) throw new Error("Unauthorized");

    await connectDB();
    const blog = await Blog.findByIdAndUpdate(blogId, { status: "rejected", rejectionReason }, { new: true });

    // Notify Creator
    if (blog && blog.authorId) {
        try {
            const client = await clerkClient();
            const authorUser = await client.users.getUser(blog.authorId);
            const authorEmail = authorUser.emailAddresses[0]?.emailAddress;
            const authorName = authorUser.firstName || "Creator";

            if (authorEmail) {
                await sendBrevoEmail(
                    authorEmail,
                    authorName,
                    "Update on your BlogIQ submission",
                    getBlogRejectionTemplate(authorName, blog.title, rejectionReason)
                );
            }
        } catch (e) {
            console.error("Failed to send rejection email:", e);
        }
    }

    if (revokeCreator && authorId) {
        await revokeCreatorPrivileges(authorId, authorName);
    }

    revalidatePath("/admin");
}

export async function setCreatorRoleAction(targetUserId, action) {
    const isAdmin = await checkRole("admin");
    if (!isAdmin) throw new Error("Unauthorized");

    let newMetadata = {};
    if (action === "upgrade") {
        newMetadata = { role: "creator", creatorStatus: "active" };
    } else if (action === "reject_application") {
        newMetadata = { role: "user", creatorStatus: "rejected" };
    } else if (action === "revoke") {
        newMetadata = { role: "user", creatorStatus: "revoked" };
    } else {
        throw new Error("Invalid action");
    }

    const client = await clerkClient();
    const user = await client.users.getUser(targetUserId);

    await client.users.updateUser(targetUserId, {
        publicMetadata: newMetadata
    });

    await connectDB();
    await User.findOneAndUpdate(
        { clerkId: targetUserId },
        {
            $set: {
                clerkId: targetUserId,
                email: user.emailAddresses[0]?.emailAddress || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                role: newMetadata.role,
                creatorStatus: newMetadata.creatorStatus
            }
        },
        { upsert: true, new: true }
    );

    const targetEmail = user.emailAddresses[0]?.emailAddress;
    const targetName = user.firstName || "Creator";

    if (targetEmail) {
        if (action === "upgrade") {
            sendBrevoEmail(
                targetEmail,
                targetName,
                "Application Approved: Welcome to BlogIQ Creators! 🎉",
                getCreatorAcceptanceTemplate(targetName)
            ).catch(console.error);
        } else if (action === "reject_application") {
            sendBrevoEmail(
                targetEmail,
                targetName,
                "Update on your BlogIQ Creator Application",
                getCreatorRejectionTemplate(targetName)
            ).catch(console.error);
        }
    }

    revalidatePath("/admin");
}

async function revokeCreatorPrivileges(targetUserId, authorName) {
    await setCreatorRoleAction(targetUserId, "revoke");
}

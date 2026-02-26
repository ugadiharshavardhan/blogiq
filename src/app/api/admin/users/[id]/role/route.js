import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkRole } from "@/lib/roles";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendBrevoEmail, getCreatorAcceptanceTemplate, getCreatorRejectionTemplate } from "@/lib/sendEmail";

export async function PUT(req, { params }) {
    try {
        const { userId } = await auth();
        const isAdmin = await checkRole("admin");
        if (!userId || !isAdmin) {
            return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
        }

        const { action } = await req.json();

        const resolvedParams = await params;
        const targetUserId = resolvedParams.id;

        let newMetadata = {};

        if (action === "upgrade") {
            newMetadata = {
                role: "creator",
                creatorStatus: "active"
            };
        } else if (action === "reject_application") {
            newMetadata = {
                role: "user",
                creatorStatus: "rejected"
            };
        } else if (action === "revoke") {
            newMetadata = {
                role: "user",
                creatorStatus: "revoked"
            };
        } else {
            return NextResponse.json({ error: "Invalid action." }, { status: 400 });
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
        // Send emails asynchronously (don't block the response)
        const targetEmail = user.emailAddresses[0]?.emailAddress;
        const targetName = user.firstName || "Creator";

        if (targetEmail) {
            if (action === "upgrade") {
                sendBrevoEmail(
                    targetEmail,
                    targetName,
                    "Application Approved: Welcome to BlogIQ Creators! 🎉",
                    getCreatorAcceptanceTemplate(targetName)
                ).catch(console.error); // Silently catch email errors
            } else if (action === "reject_application") {
                sendBrevoEmail(
                    targetEmail,
                    targetName,
                    "Update on your BlogIQ Creator Application",
                    getCreatorRejectionTemplate(targetName)
                ).catch(console.error);
            }
        }

        return NextResponse.json({ message: `User privileges updated successfully.` });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user privileges", details: error.message }, { status: 500 });
    }
}

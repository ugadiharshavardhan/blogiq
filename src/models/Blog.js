import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        category: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        excerpt: {
            type: String,
        },
        coverImage: {
            type: String,
        },
        authorId: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        rejectionReason: {
            type: String,
            default: null,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

import mongoose from "mongoose";

const BlogViewSchema = new mongoose.Schema(
    {
        blogId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        ips: [{
            type: String,
        }],
    },
    { timestamps: true }
);

export default mongoose.models.BlogView || mongoose.model("BlogView", BlogViewSchema);

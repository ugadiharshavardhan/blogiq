import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema(
    {
        blogId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Summary ||
    mongoose.model("Summary", SummarySchema);

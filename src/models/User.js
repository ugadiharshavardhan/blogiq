import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "creator", "user"],
        default: "user"
    },
    creatorStatus: {
        type: String,
        enum: ["none", "pending", "active", "rejected", "revoked"],
        default: "none"
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;

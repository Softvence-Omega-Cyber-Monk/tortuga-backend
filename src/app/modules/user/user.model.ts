import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from "bcryptjs"

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    role: {
        type: String,
        enum: ["ADMIN", "CUSTOMER"],
        default: "CUSTOMER"
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = model<IUser>("User", userSchema);
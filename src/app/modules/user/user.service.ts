import { UserModel } from "./user.model";
import { IUser } from "./user.interface";
import jwt from "jsonwebtoken"

interface TokenPair {
    accessToken: string,
    refreshToken: string
}

export class UserService {
    async registerCustomer(payload: Partial<IUser>): Promise<{ user: IUser; accessToken: string, refreshToken: string }> {
        payload.role = "CUSTOMER";
        const existingUser = await UserModel.findOne({ email: payload.email })
        if (existingUser) throw new Error("Email Already Exists");
        const user = new UserModel(payload);
        await user.save();
        const { accessToken, refreshToken } = this.generateTokens(user.id.toString(), user.role)
        return { user, accessToken, refreshToken }
    }
    private generateAccessToken(id: string, role: string) {
        const secret = process.env.JWT_SECRET || "secretKey";
        return jwt.sign({ id, role }, secret, { expiresIn: "30m" })
    }
    private generateRefreshToken(id: string, role: string) {
        const secret = process.env.JWT_REFRESH_SECRET || "refreshSecretKey";
        return jwt.sign({ id, role }, secret, { expiresIn: "7d" })
    }
    private generateTokens(id: string, role: string) {
        return {
            accessToken: this.generateAccessToken(id, role),
            refreshToken: this.generateRefreshToken(id, role)
        }
    }
    async login(email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        const user = await UserModel.findOne({ email }).select("+password");
        if (!user) throw new Error("Invalid email or password");

        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new Error("Invalid email or password");
        const { accessToken, refreshToken } = this.generateTokens(user.id.toString(), user.role);
        user.password = "";
        return { user, accessToken, refreshToken };
    }
    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const secret = process.env.JWT_REFRESH_SECRET || "refresh_secretkey";
            const decoded = jwt.verify(refreshToken, secret) as { id: string; role: string };

            // Verify user still exists and is active
            const user = await UserModel.findById(decoded.id);
            if (!user || !user.isActive) {
                throw new Error("User not found or inactive");
            }

            const accessToken = this.generateAccessToken(decoded.id, decoded.role);
            return { accessToken };
        } catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }
    async getUserById(userId: string): Promise<IUser | null> {
        const user = await UserModel.findById(userId);
        if (!user) throw new Error("User not found");
        return user;
    }
    async updateUser(userId: string, payload: Partial<IUser>): Promise<IUser | null> {
        // Prevent role or sensitive changes via this method
        delete payload.role;
        const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) throw new Error("User not found");
        return updatedUser;
    }
    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        const user = await UserModel.findById(userId).select("+password");
        if (!user) throw new Error("User not found");

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) throw new Error("Current password is incorrect");

        // Update password (pre-save hook should hash it)
        user.password = newPassword;
        await user.save();
    }
    async deleteUser(userId: string): Promise<void> {
        const user = await UserModel.findById(userId);
        if (!user) throw new Error("User not found");

        await UserModel.findByIdAndDelete(userId);
    }
    async getAllCustomers(): Promise<IUser[]> {
        return UserModel.find({ role: "CUSTOMER" });
    }
}

export const userService = new UserService()
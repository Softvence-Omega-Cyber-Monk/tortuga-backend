export interface IUser {
    name: string,
    email: string,
    password: string,
    role: "ADMIN" | "CUSTOMER",
    isActive: boolean,
    address: string
    phone: string,
    comparePassword(candidatePassword: string): Promise<boolean>;
}
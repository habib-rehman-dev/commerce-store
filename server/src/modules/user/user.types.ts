export interface IUser {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "customer" | "admin";
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
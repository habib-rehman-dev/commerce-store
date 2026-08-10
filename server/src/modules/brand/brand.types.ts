export interface IBrand {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status: "active" | "inactive";
  logoPublicId?: string; // Add this line
  createdAt: Date;
  updatedAt: Date;
}

export interface IBrand {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

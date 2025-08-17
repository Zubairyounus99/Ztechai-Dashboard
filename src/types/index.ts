import { z } from "zod";

export const STATUSES = ["Prospect", "Onboarding", "Active", "Churned"] as const;
export const PROJECT_STATUSES = ["Discovery", "In Progress", "On Hold", "Completed", "Cancelled"] as const;
export const SERVICES = ["Web Development", "SEO", "Social Media", "Content Creation", "PPC"] as const;
export const PAYMENT_STATUSES = ["Paid", "Pending", "Overdue"] as const;

export type Status = typeof STATUSES[number];
export type ProjectStatus = typeof PROJECT_STATUSES[number];
export type Service = typeof SERVICES[number];
export type PaymentStatus = typeof PAYMENT_STATUSES[number];

export const clientSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  address: z.string().optional(),
  services: z.array(z.string()),
  status: z.enum(STATUSES),
  lastContact: z.string(),
  projectStatus: z.enum(PROJECT_STATUSES),
  designCharges: z.coerce.number().optional(),
  amountPaid: z.coerce.number().optional(),
  monthlySubscription: z.coerce.number().optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  assignedTo: z.string().optional(),
});

export type Client = z.infer<typeof clientSchema>;

export type UserRole = "Admin" | "Employee";

export type User = {
  id: string;
  name: string;
  role: UserRole;
};

export type Todo = {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
  due_date?: string | null;
};
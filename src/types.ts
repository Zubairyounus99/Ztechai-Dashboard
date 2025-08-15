import { z } from "zod";

export const SERVICES = ["AI Chatbots", "AI Voice Agents", "AI Automations"] as const;
export const STATUSES = ["Prospect", "Interested", "Client", "On Hold", "Inactive"] as const;
export const PROJECT_STATUSES = ["Discovery", "Designing", "In Development", "Deployed", "Maintenance"] as const;
export const PAYMENT_STATUSES = ["Paid", "Pending", "Overdue"] as const;

export const clientSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number seems too short."),
  address: z.string().optional(),
  services: z.array(z.enum(SERVICES)).min(1, "At least one service must be selected."),
  status: z.enum(STATUSES),
  lastContact: z.string(),
  projectStatus: z.enum(PROJECT_STATUSES),
  designCharges: z.coerce.number().positive().optional(),
  amountPaid: z.coerce.number().nonnegative().optional(),
  monthlySubscription: z.coerce.number().nonnegative().optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
});

export type Client = z.infer<typeof clientSchema>;

// For compatibility with existing components
export type Status = typeof STATUSES[number];
export type ProjectStatus = typeof PROJECT_STATUSES[number];

// User and Role types for authentication
export type Role = "Admin" | "Employee";

export interface User {
  id: string;
  name: string;
  role: Role;
}
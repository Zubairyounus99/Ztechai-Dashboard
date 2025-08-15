export const STATUSES = ["Prospect", "Interested", "Client", "On Hold", "Past Client"] as const;
export type Status = typeof STATUSES[number];

export const PROJECT_STATUSES = ["Not Started", "In Progress", "Awaiting Feedback", "Completed", "On Hold"] as const;
export type ProjectStatus = typeof PROJECT_STATUSES[number];

export interface Client {
  id: string;
  name: string;
  email: string;
  status: Status;
  projectStatus: ProjectStatus;
  monthlySubscription?: number;
  designCharges?: number;
  amountPaid?: number;
  lastContact: string; // ISO 8601 date string
}

export type Role = "Admin" | "Employee";

export interface User {
  id: string;
  name: string;
  role: Role;
}
export interface Child {
  id: string;

  // Required
  firstName: string;
  lastName: string;

  // Optional
  dob?: string;
  oapNumber?: string;
  ohipNumber?: string;
  diagnosis?: string;
  gender?: string;
  school?: string;
  notes?: string;

  // Status
  status: "active" | "archived";

  createdAt?: any;
}
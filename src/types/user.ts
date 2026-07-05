export type UserRole = 'Logistics Operator';

export interface UserProfile {
  uid: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: number;
}

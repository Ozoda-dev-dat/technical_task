import { z } from "zod";

// === ASOSIY SXEMALAR ===

export const insertUserSchema = z.object({
  firstName: z.string().min(1, "Ism kiritilishi shart"),
  lastName: z.string().min(1, "Familiya kiritilishi shart"),
  email: z.string().email("Noto'g'ri email formati"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

export const insertRoleSchema = z.object({
  name: z.string().min(1, "Rol nomi kiritilishi shart"),
});

// === API KONTRAKT TIPLARI ===

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date | null;
};

export type Role = {
  id: number;
  name: string;
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRole = z.infer<typeof insertRoleSchema>;

// So'rov tiplari
export type LoginRequest = { email: string; password: string };
export type CreateUserRequest = InsertUser & { roles: string[] };
export type UpdateUserRequest = Partial<InsertUser> & { roles?: string[] };

// Javob tiplari
export type UserWithRoles = Omit<User, 'password'> & { roles: string[] };
export type LoginResponse = { token: string; user: UserWithRoles };
export type PaymentMock = { id: number; amount: number; currency: string; recipient: string; status: string; date: string };
export type ReportMock = { id: number; title: string; type: string; content: string; generatedAt: string };

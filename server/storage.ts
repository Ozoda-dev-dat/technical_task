import { db } from "./db";
import {
  type User, type Role, type UserWithRoles
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserWithRoles(id: number): Promise<UserWithRoles | undefined>;
  getUsersWithRoles(): Promise<UserWithRoles[]>;
  createUser(user: any, roleNames: string[]): Promise<UserWithRoles>;
  updateUser(id: number, updates: any, roleNames?: string[]): Promise<UserWithRoles>;
  deleteUser(id: number): Promise<void>;
  
  getRoles(): Promise<Role[]>;
  createRole(name: string): Promise<Role>;
  getRoleByName(name: string): Promise<Role | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const user = await db.user.findUnique({ where: { id } });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await db.user.findUnique({ where: { email } });
    return user || undefined;
  }

  async getUserWithRoles(id: number): Promise<UserWithRoles | undefined> {
    const user = await db.user.findUnique({
      where: { id },
      include: { roles: { include: { role: true } } }
    });
    if (!user) return undefined;

    const { password: _, ...userWithoutPassword } = user;
    return { 
      ...userWithoutPassword, 
      roles: user.roles.map(ur => ur.role.name) 
    } as UserWithRoles;
  }

  async getUsersWithRoles(): Promise<UserWithRoles[]> {
    const allUsers = await db.user.findMany({
      include: { roles: { include: { role: true } } }
    });
    
    return allUsers.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        roles: user.roles.map(ur => ur.role.name)
      } as UserWithRoles;
    });
  }

  async createUser(insertUser: any, roleNames: string[]): Promise<UserWithRoles> {
    const roles = await db.role.findMany({
      where: { name: { in: roleNames } }
    });

    const user = await db.user.create({
      data: {
        ...insertUser,
        roles: {
          create: roles.map(role => ({
            roleId: role.id
          }))
        }
      },
      include: { roles: { include: { role: true } } }
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      roles: user.roles.map(ur => ur.role.name)
    } as UserWithRoles;
  }

  async updateUser(id: number, updates: any, roleNames?: string[]): Promise<UserWithRoles> {
    const data: any = { ...updates };

    if (roleNames) {
      const roles = await db.role.findMany({
        where: { name: { in: roleNames } }
      });

      data.roles = {
        deleteMany: {},
        create: roles.map(role => ({
          roleId: role.id
        }))
      };
    }

    const user = await db.user.update({
      where: { id },
      data,
      include: { roles: { include: { role: true } } }
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      roles: user.roles.map(ur => ur.role.name)
    } as UserWithRoles;
  }

  async deleteUser(id: number): Promise<void> {
    await db.userRole.deleteMany({ where: { userId: id } });
    await db.user.delete({ where: { id } });
  }

  async getRoles(): Promise<Role[]> {
    const roles = await db.role.findMany();
    return roles as Role[];
  }

  async createRole(name: string): Promise<Role> {
    const role = await db.role.create({ data: { name } });
    return role as Role;
  }

  async getRoleByName(name: string): Promise<Role | undefined> {
    const role = await db.role.findUnique({ where: { name } });
    return role || undefined;
  }
}

export const storage = new DatabaseStorage();

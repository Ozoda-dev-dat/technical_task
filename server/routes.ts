import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Custom request type to include authenticated user data
 */
interface AuthRequest extends Request {
  user?: {
    id: number;
    roles: string[];
  };
}

/**
 * Registers all API routes for the application
 */
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  /**
   * Database Seeding Logic
   * Ensures essential roles and an admin user exist on startup
   */
  async function seed() {
    // 1. Initialize core system roles
    const requiredRoles = ["ADMIN", "PAYMENT", "REPORTS"];
    for (const roleName of requiredRoles) {
      const existing = await storage.getRoleByName(roleName);
      if (!existing) {
        await storage.createRole(roleName);
        console.log(`[Seed] Created role: ${roleName}`);
      }
    }

    // 2. Initialize system administrator
    const adminEmail = "admin@bank.com";
    const existingAdmin = await storage.getUserByEmail(adminEmail);
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await storage.createUser({
        email: adminEmail,
        password: hashedPassword,
        firstName: "System",
        lastName: "Admin"
      }, ["ADMIN", "PAYMENT", "REPORTS"]);
      console.log(`[Seed] Created default admin: ${adminEmail}`);
    }

    // 3. Populate demo environment
    const users = await storage.getUsersWithRoles();
    if (users.length <= 1) {
        const payPass = await bcrypt.hash("user123", 10);
        await storage.createUser({
            email: "payment@bank.com",
            password: payPass,
            firstName: "John",
            lastName: "Doe"
        }, ["PAYMENT"]);

        const reportPass = await bcrypt.hash("user123", 10);
        await storage.createUser({
            email: "reports@bank.com",
            password: reportPass,
            firstName: "Jane",
            lastName: "Smith"
        }, ["REPORTS"]);
        
        console.log("[Seed] Demo users initialized");
    }
  }

  // Run initialization
  try {
      await seed();
  } catch (e) {
      console.error("[Auth] Seeding failed:", e);
  }

  // === AUTHENTICATION MIDDLEWARE ===

  /**
   * Verifies JWT token from Authorization header
   */
  const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Token taqdim etilmadi" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(401).json({ message: "Token yaroqsiz yoki muddati o'tgan" });
      req.user = user as { id: number, roles: string[] };
      next();
    });
  };

  /**
   * Authorizes access based on user roles
   */
  const requireRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) return res.status(401).json({ message: "Siz avtorizatsiyadan o'tmagansiz" });
      
      const hasRole = req.user.roles.includes(role);
      const isAdmin = req.user.roles.includes("ADMIN");

      if (!hasRole && !isAdmin) {
         return res.status(403).json({ message: "Kirish rad etildi: ruxsatingiz yetarli emas" });
      }
      next();
    };
  };
  
  /**
   * Strict administrative access check
   */
  const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user || !req.user.roles.includes("ADMIN")) {
          return res.status(403).json({ message: "Kirish rad etildi: faqat administratorlar uchun" });
      }
      next();
  }

  // === AUTH ROUTES ===

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { email, password } = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Elektron pochta yoki parol noto'g'ri" });
      }

      const userWithRoles = await storage.getUserWithRoles(user.id);
      if (!userWithRoles) return res.status(500).json({ message: "Ichki xatolik yuz berdi" });

      const token = jwt.sign(
        { id: user.id, roles: userWithRoles.roles, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
      );

      res.json({ token, user: userWithRoles });
    } catch (e) {
      if (e instanceof z.ZodError) {
          return res.status(400).json({ message: "Validatsiya xatosi", field: e.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Serverda ichki xatolik yuz berdi" });
    }
  });

  app.get(api.auth.me.path, authenticateToken, async (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ message: "Siz avtorizatsiyadan o'tmagansiz" });
    const user = await storage.getUserWithRoles(req.user.id);
    if (!user) return res.status(404).json({ message: "Foydalanuvchi tizimda topilmadi" });
    res.json(user);
  });

  // === USER MANAGEMENT (ADMIN ONLY) ===

  app.get(api.users.list.path, authenticateToken, requireAdmin, async (req, res) => {
    const users = await storage.getUsersWithRoles();
    res.json(users);
  });

  app.get(api.users.get.path, authenticateToken, requireAdmin, async (req, res) => {
      const user = await storage.getUserWithRoles(Number(req.params.id));
      if (!user) return res.status(404).json({ message: "Foydalanuvchi tizimda topilmadi" });
      res.json(user);
  });

  app.post(api.users.create.path, authenticateToken, requireAdmin, async (req, res) => {
    try {
      const input = api.users.create.input.parse(req.body);
      
      const existing = await storage.getUserByEmail(input.email);
      if (existing) {
        return res.status(409).json({ message: "Foydalanuvchi allaqachon mavjud" });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      
      const newUser = await storage.createUser({
        ...input,
        password: hashedPassword
      }, input.roles.filter(r => r !== "ADMIN")); // Admin role cannot be assigned to new users per requirement

      res.status(201).json(newUser);
    } catch (e) {
      if (e instanceof z.ZodError) {
          return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Serverda ichki xatolik yuz berdi" });
    }
  });

  app.put(api.users.update.path, authenticateToken, requireAdmin, async (req, res) => {
     try {
         const id = Number(req.params.id);
         const input = api.users.update.input.parse(req.body);
         
         if (input.password) {
             input.password = await bcrypt.hash(input.password, 10);
         }

         const updated = await storage.updateUser(id, input, input.roles);
         res.json(updated);
     } catch (e) {
         if (e instanceof z.ZodError) {
             return res.status(400).json({ message: e.errors[0].message });
         }
         res.status(404).json({ message: "Foydalanuvchi topilmadi yoki yangilashda xatolik" });
     }
  });

  app.delete(api.users.delete.path, authenticateToken, requireAdmin, async (req, res) => {
      try {
          await storage.deleteUser(Number(req.params.id));
          res.sendStatus(204);
      } catch (e) {
          res.status(404).json({ message: "Foydalanuvchi topilmadi yoki allaqachon o'chirilgan" });
      }
  });


  // === ROLES ===
  
  app.get(api.roles.list.path, authenticateToken, requireAdmin, async (req, res) => {
      const roles = await storage.getRoles();
      res.json(roles);
  });

  // === PROTECTED RESOURCES ===

  app.get(api.payments.list.path, authenticateToken, requireRole("PAYMENT"), (req, res) => {
    // Mock Data
    const payments = Array.from({ length: 5 }).map((_, i) => ({
        id: i + 1,
        amount: Math.floor(Math.random() * 10000) + 100,
        currency: "USD",
        recipient: `Client ${i + 1}`,
        status: i % 2 === 0 ? "Completed" : "Pending",
        date: new Date().toISOString()
    }));
    res.json(payments);
  });

  app.get(api.reports.list.path, authenticateToken, requireRole("REPORTS"), (req, res) => {
    // Mock Data
    const reports = Array.from({ length: 3 }).map((_, i) => ({
        id: i + 1,
        title: `Financial Report Q${i + 1}`,
        type: "PDF",
        content: "Confidential financial data...",
        generatedAt: new Date().toISOString()
    }));
    res.json(reports);
  });

  return httpServer;
}

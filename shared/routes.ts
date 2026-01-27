import { z } from 'zod';
import { insertUserSchema } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
  forbidden: z.object({ message: z.string() }),
  conflict: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({ email: z.string().email("Elektron pochta formati noto'g'ri"), password: z.string().min(1, "Parol kiritilishi shart") }),
      responses: {
        200: z.object({ 
          token: z.string(), 
          user: z.object({
            id: z.number(),
            email: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            roles: z.array(z.string())
          })
        }),
        401: errorSchemas.unauthorized,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.custom<any>(), // UserWithRoles
        401: errorSchemas.unauthorized,
      },
    }
  },
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users',
      responses: {
        200: z.array(z.custom<any>()), // UserWithRoles[]
        403: errorSchemas.forbidden,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/users/:id',
      responses: {
        200: z.custom<any>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/users',
      input: insertUserSchema.extend({ roles: z.array(z.string()) }),
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
        403: errorSchemas.forbidden,
        409: errorSchemas.conflict,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/users/:id',
      input: insertUserSchema.partial().extend({ roles: z.array(z.string()).optional() }),
      responses: {
        200: z.custom<any>(),
        400: errorSchemas.validation,
        403: errorSchemas.forbidden,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/users/:id',
      responses: {
        204: z.void(),
        403: errorSchemas.forbidden,
        404: errorSchemas.notFound,
      },
    },
  },
  roles: {
    list: {
      method: 'GET' as const,
      path: '/api/roles',
      responses: {
        200: z.array(z.object({ id: z.number(), name: z.string() })),
      },
    },
  },
  payments: {
    list: {
      method: 'GET' as const,
      path: '/api/payments',
      responses: {
        200: z.array(z.object({ 
          id: z.number(), 
          amount: z.number(), 
          currency: z.string(),
          recipient: z.string(),
          status: z.string(), 
          date: z.string() 
        })),
        403: errorSchemas.forbidden,
      },
    },
  },
  reports: {
    list: {
      method: 'GET' as const,
      path: '/api/reports',
      responses: {
        200: z.array(z.object({ 
          id: z.number(), 
          title: z.string(), 
          type: z.string(),
          content: z.string(), 
          generatedAt: z.string() 
        })),
        403: errorSchemas.forbidden,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

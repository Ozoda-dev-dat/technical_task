## Packages
framer-motion | Page transitions and complex animations
date-fns | Date formatting for reports and payments
lucide-react | Icons for the sidebar and UI elements

## Notes
- Auth uses JWT token returned from login. Stored in localStorage 'auth_token'.
- Role-Based Access Control (RBAC) enforced on client-side via `useAuth` hook and Sidebar logic.
- Admin role name: "ADMIN"
- Payment role name: "PAYMENT"
- Reports role name: "REPORTS"

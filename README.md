**Fullstack Technical Task**

Role-based Access Control (RBAC) bilan foydalanuvchilarni boshqarish tizimi
Loyiha tavsifi

Ushbu loyiha fullstack texnik topshiriq asosida ishlab chiqilgan bo‘lib rolga asoslangan ruxsatlar (RBAC) JWT autentifikatsiya va to‘liq CRUD funksionalligini o‘z ichiga oladi.
Ilova bank yoki korporativ tizimlar uchun mo‘ljallangan bo‘lib foydalanuvchilarning rollar asosida sahifalarga kirishini qat’iy nazorat qiladi.

Asosiy imkoniyatlar (Features)
-JWT asosida autentifikatsiya (1 soatlik token)
-Role-Based Access Control (ADMIN, PAYMENT, REPORTS)
-Ruxsatsiz foydalanuvchilar uchun 403 Access Denied
-ADMIN uchun to‘liq user management (CRUD)
-Yangi foydalanuvchiga ADMIN rolini berish qat’iy taqiqlangan
-/payments va /reports sahifalari uchun mock backend data
-To‘liq responsive UI (Ant Design)

Arxitektura
Frontend (React + Vite)
        │
        │  RTK Query (API layer)
        ▼
Backend (Node.js + Express)
        │
        │  Prisma ORM
        ▼
PostgreSQL

**Texnologiyalar**
Frontend
  - React 18
  - Vite
  - Redux Toolkit + RTK Query
  - Ant Design (asosiy UI kutubxonasi)
  - TypeScript
Backend
  - Node.js
  - Express.js
  - Prisma ORM
  - PostgreSQL
  - JWT (jsonwebtoken)
  - dotenv

Loyiha strukturasi
technical_task/
├─ client/              
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ store/
│  │  ├─ services/      
│  │  └─ components/
│
├─ server/              
│  ├─ routes.ts
│  ├─ auth/
│  └─ middleware/
│
├─ prisma/
│  └─ schema.prisma     
│
└─ README.md

**Database modeli**
  - users
  - roles
  - user_roles (many-to-many)

**Prisma ORM yordamida:**
Primary & Foreign Key’lar
Referential integrity
Clean schema

**Rollar va ruxsatlar**
Rol	Huquqlar
ADMIN	Barcha sahifalar, user CRUD, role boshqaruvi
PAYMENT	Faqat /payments
REPORTS	Faqat /reports

**Muhim qoida:**
Yangi foydalanuvchiga ADMIN roli berilmaydi (backend darajada cheklangan).

**O‘rnatish va ishga tushirish**
1️. Repository’ni klon qilish
git clone https://github.com/Ozoda-dev-dat/technical_task.git
cd technical_task

2️. Backend sozlash
cd server
npm install

**.env fayl yarating:**
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_secret_key

**Prisma migratsiya:**
npx prisma migrate dev


**Serverni ishga tushirish:**
npm run dev

3️. Frontend sozlash
cd client
npm install
npm run dev


Frontend ishga tushadi:

http://localhost:5173

**Default test foydalanuvchilar**
Rol	Email	Parol
ADMIN	admin@bank.com
Password - admin123
PAYMENT	payment@bank.com
Password - user123
REPORTS	reports@bank.com
Password - user123

**Xavfsizlik**

JWT token bilan himoyalangan route’lar
Backend va frontend’da role tekshiruvi
Ruxsatsiz kirish → 403 Access Denied

**Deployment**

Loyiha production uchun tayyor:
build scriptlar mavjud
Prisma bilan production migration qo‘llab-quvvatlanadi


🧑‍💻 Muallif
Ozodakhon Aminjonova
Fullstack Developer
TG: https://t.me/s0ft_engin_lady

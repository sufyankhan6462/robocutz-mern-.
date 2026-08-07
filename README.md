# RoboCutz — Barber Shop Website & Management System (MERN Stack)

> **Complete 6-Week Internship Training Project Solution**

RoboCutz is a modern full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application and internal staff management system designed for a high-end barber shop studio. It includes customer online slot booking, real-time barber availability, role-based dashboards (Customer, Barber, Receptionist, Admin), a Walk-in Point-of-Sale (POS) screen with automatic retail product stock updates, and visual financial analytics.

---

## 🚀 Key Features

### 🌐 Public Barber Shop Website
- **Hero & Experience Showcase**: Sleek dark charcoal & gold studio aesthetic with quick booking CTA.
- **Master Barbers Directory (`/barbers`, `/barber/:id`)**: Browse barbers with specialty filters, experience ratings, working schedules, and individual bio pages.
- **Services Menu (`/services`)**: Filterable haircut, beard sculpt, coloring, and combo packages with pricing and duration badges.
- **Hairstyle Gallery (`/gallery`)**: Filterable work samples showcase (Fades, Beards, Classics, Colorings).
- **Contact & Map Location (`/contact`)**: Interactive shop location map, contact info, and direct message inquiry form.

### 📅 Online Booking System
- **4-Step Slot Reservation Engine**:
  1. Select Barber
  2. Select Service
  3. Pick Date & Real-time Available Time Slot (Slot blocking prevents double bookings)
  4. Review & Confirm with Nodemailer email simulation.
- **Customer Dashboard (`/dashboard`)**: View upcoming & past bookings, cancel reservations, edit profile.

### 💼 Staff & Admin Internal Management System (`/admin`)
- **Role-Based Access Control (RBAC)**: Secure access restricted to Admin, Barber, or Receptionist roles.
- **Dashboard Overview**: Metrics snapshot (Today's appointments, Walk-in count, Total revenue) and daily appointment timeline.
- **Appointments Manager**: Table view with date/barber/status filters and status workflow actions (`Confirm` → `Complete` → `No-Show` → `Cancel`).
- **Walk-in POS Screen**: Multi-item cart for walk-in services + retail products, discount calculator, payment method selector, auto stock updates, and printable receipt modal.
- **Barbers & Services CRUD**: Admin interfaces to manage barber profiles, photo URLs, services, pricing, and durations.
- **Retail Inventory**: Admin CRUD for retail grooming products with low-stock badges.
- **Staff Accounts Manager**: Admin tool to create new Barber or Receptionist user accounts.
- **Reports & Financial Analytics**: Visual charts (Recharts) detailing 7-day revenue trends and appointment status distributions.

---

## 🔑 Pre-Seeded Test Credentials

The database is pre-seeded with test accounts for immediate evaluation:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@robocutz.com` | `admin123` | Full access to all staff modules, CRUD operations, & analytics |
| **Receptionist** | `receptionist@robocutz.com` | `receptionist123` | Access to appointments list, POS walk-in screen, & inventory stock |
| **Barber** | `barber@robocutz.com` | `barber123` | Access to overview dashboard & own assigned appointments schedule |
| **Customer** | `customer@robocutz.com` | `customer123` | Access to customer booking history & cancellation portal |

---

## 🛠️ Project Structure & Tech Stack

```
robocutz-mern/
├── server/                   # Express.js + Node.js Backend API
│   ├── config/               # Database connection (MongoDB + Memory Server fallback)
│   ├── middleware/           # JWT Authentication & RBAC middleware
│   ├── models/               # User, Barber, Service, Appointment, Product, Sale schemas
│   ├── routes/               # RESTful API route endpoints
│   ├── seed.js               # Database seeding script
│   └── server.js             # Express server entry point
│
├── client/                   # React.js + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/       # Navbar, Footer, BookingModal, StatusBadge, ReceiptModal
│   │   ├── context/          # AuthContext for global user session
│   │   ├── pages/public/     # Home, Barbers, Services, Gallery, About, Contact, Auth
│   │   ├── pages/customer/   # CustomerDashboard
│   │   └── pages/admin/      # StaffLayout, Dashboard, POS, Barbers, Services, Reports
│   ├── index.html
│   └── vite.config.js
└── README.md
```

- **Frontend**: React 18, React Router v6, Tailwind CSS, Lucide React icons, Recharts, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose ODM), JWT (`jsonwebtoken`), `bcryptjs`, `dotenv`.

---

## ⚡ Quick Start Guide (Local Setup)

### 1. Install Dependencies
Open terminal in the project root folder:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Seed Database
Run the seed script to populate sample barbers, services, products, and default user accounts:
```bash
cd server
npm run seed
```

### 3. Start Backend Server & Frontend Client
In two separate terminal windows:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Express API running on http://localhost:5000
```

**Terminal 2 (React Frontend):**
```bash
cd client
npm run dev
# React App running on http://localhost:3000
```

Open `http://localhost:3000` in your web browser!

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Customer Registration | Public |
| `POST` | `/api/auth/login` | Login for all roles | Public |
| `GET` | `/api/auth/me` | Fetch active user profile | Private |
| `POST` | `/api/auth/create-staff` | Create Barber/Receptionist account | Admin |
| `GET` | `/api/barbers` | Get barbers list (with specialty filter) | Public |
| `GET/POST/PUT/DELETE` | `/api/barbers/:id` | Barber profile CRUD | Admin / Barber |
| `GET` | `/api/services` | Get services menu | Public |
| `GET/POST/PUT/DELETE` | `/api/services/:id` | Service CRUD | Admin |
| `GET` | `/api/slots/available` | Real-time available slot engine | Public |
| `GET/POST` | `/api/appointments` | Book / List appointments | Customer / Staff |
| `PUT` | `/api/appointments/:id/status` | Update status (complete/cancel) | Staff / Customer |
| `GET/POST/PUT/DELETE` | `/api/products` | Grooming products inventory | Admin / Staff |
| `GET/POST` | `/api/sales` | Record POS walk-in sale & print receipt | Admin / Receptionist |
| `GET` | `/api/reports/analytics` | Fetch visual financial charts data | Admin |

---

## 🌐 Production Deployment Guide

1. **Database**: Create a MongoDB Atlas cluster, obtain the connection URI, and update `MONGODB_URI` in `.env`.
2. **Backend**: Deploy `/server` to [Render](https://render.com) or [Railway](https://railway.app). Set environment variables (`MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`).
3. **Frontend**: Deploy `/client` to [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Update `baseURL` in `api.js` to your deployed backend URL.

---

## 🎓 Internship Curriculum Verification Matrix

- ✅ **Week 1**: Environment setup, MongoDB schema design, Node/Express JWT authentication.
- ✅ **Week 2**: Barber Profile CRUD, Services APIs, Slot Availability engine, Appointment booking & POS sales APIs.
- ✅ **Week 3**: React setup, Tailwind CSS theme, reusable components, Public Home, Barbers, Services, Gallery, Contact pages.
- ✅ **Week 4**: Register/Login auth forms, JWT AuthContext, Protected routes, Interactive 4-step booking modal & Customer Dashboard.
- ✅ **Week 5**: Staff Dashboard layout, Appointments calendar/table manager, Walk-in POS screen with receipt generator, Admin management for Barbers/Services/Products, and Recharts reports.
- ✅ **Week 6**: End-to-end testing, error handling, responsive polish, seeding automation, and complete documentation.

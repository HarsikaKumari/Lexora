<div align="center">

<img src="https://img.shields.io/badge/Lexora-Legal%20Consultation%20Platform-1a1a2e?style=for-the-badge&logo=scales&logoColor=white" alt="Lexora Banner"/>

# ⚖️ Lexora — Online Legal Consultation & Document Generation Platform

**Connecting Clients with Legal Professionals. Seamlessly. Securely. Smartly.**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Lexora-4CAF50?style=for-the-badge)](https://lexora-xi-liart.vercel.app/)
[![Video Demo](https://img.shields.io/badge/🎬%20Video%20Presentation-Watch%20Now-FF5722?style=for-the-badge)](https://www.instagram.com/reel/DXmsbzmEyvI/?igsh=YW9tMHJ6eXI3OGRu)
[![GitHub](https://img.shields.io/badge/GitHub-HarsikaKumari%2FLexora-181717?style=for-the-badge&logo=github)](https://github.com/HarsikaKumari/Lexora)

![GitHub stars](https://img.shields.io/github/stars/HarsikaKumari/Lexora?style=social)
![GitHub forks](https://img.shields.io/github/forks/HarsikaKumari/Lexora?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/HarsikaKumari/Lexora)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

---

## 📌 Table of Contents

- [About Lexora](#-about-lexora)
- [Live Demo & Video](#-live-demo--video-presentation)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [User Roles](#-user-roles)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏛️ About Lexora

**Lexora** is a full-stack web application that bridges the gap between **clients seeking legal help** and **legal professionals offering services**. It provides a secure, role-based platform where:

- 👥 **Clients** can search for legal services, book consultations, and request document generation.
- ⚖️ **Legal Professionals** can list their services, set availability and pricing, and manage bookings.
- 🛡️ **Admins** verify user identities and maintain platform integrity.

> 💡 *Whether you need help with a divorce settlement, property dispute, or need a legal document drafted — Lexora makes access to legal help fast and digital.*

---

## 🌐 Live Demo & Video Presentation

| Resource | Link |
|----------|------|
| 🚀 **Live Application** | [https://lexora-xi-liart.vercel.app/](https://lexora-xi-liart.vercel.app/) |
| 🎬 **Video Presentation** | [Watch on Instagram](https://www.instagram.com/reel/DXmsbzmEyvI/?igsh=YW9tMHJ6eXI3OGRu) |
| 💻 **GitHub Repository** | [HarsikaKumari/Lexora](https://github.com/HarsikaKumari/Lexora) |

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based user authentication
- Role-based access control (Client / Lawyer / Admin)
- Admin verification of users using unique identifiers
- Secure password hashing

### ⚖️ For Legal Professionals
- Create and manage consultation service listings
- Set availability slots and pricing
- View and manage incoming bookings
- Track client requests

### 👤 For Clients
- Register and get verified
- Search & filter legal services by:
  - Legal issue type (divorce, property, criminal, etc.)
  - Document type needed
  - Region / Location
- Book consultations online
- Request legal document generation
- View booking history and status

### 📄 Document Generation
- Template-based legal document creation
- Supports common document types (agreements, affidavits, notices, etc.)
- Download generated documents instantly

### 🛡️ Admin Panel
- Verify and manage users
- Monitor platform activity
- Manage service listings
- View system-wide bookings

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js + Vite |
| **Styling** | Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | PostgreSQL (Neon DB) |
| **Authentication** | JSON Web Tokens (JWT) |
| **HTTP Client** | Axios |
| **Deployment** | Vercel (Frontend) |
| **Version Control** | Git + GitHub |

---

## 📁 Project Structure

```
Lexora/
├── frontend/                   # React + Vite Application
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Images, icons
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ServiceCard.jsx
│   │   │   └── FilterPanel.jsx
│   │   ├── pages/              # Route-level pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ClientDashboard.jsx
│   │   │   ├── LawyerDashboard.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── ServiceListing.jsx
│   │   │   └── DocumentGenerator.jsx
│   │   ├── context/            # Auth context
│   │   ├── utils/              # Helper functions, Axios config
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                    # Node.js + Express Server
│   ├── config/
│   │   └── db.js               # Neon DB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── serviceController.js
│   │   ├── bookingController.js
│   │   ├── documentController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   └── roleMiddleware.js    # Role-based access
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── documentRoutes.js
│   │   └── adminRoutes.js
│   ├── models/
│   │   └── queries.js          # SQL query functions
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- A [Neon DB](https://neon.tech/) account (free tier works)

---

### 1. Clone the Repository

```bash
git clone https://github.com/HarsikaKumari/Lexora.git
cd Lexora
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:

```bash
node server.js
# or with auto-restart
npx nodemon server.js
```

> Backend will run at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

> Frontend will run at `http://localhost:5173`

---

## 🗄️ Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('client', 'lawyer', 'admin')) DEFAULT 'client',
  unique_identifier VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  lawyer_id INT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  legal_issue_type VARCHAR(100),
  document_type VARCHAR(100),
  region VARCHAR(100),
  price DECIMAL(10,2),
  availability TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES users(id) ON DELETE CASCADE,
  service_id INT REFERENCES services(id) ON DELETE CASCADE,
  status VARCHAR(30) DEFAULT 'pending',
  booking_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(100),
  content TEXT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📡 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/me` | Get logged-in user profile |

### Service Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Get all services (with filters) |
| POST | `/api/services` | Create a new service (Lawyer only) |
| PUT | `/api/services/:id` | Update a service |
| DELETE | `/api/services/:id` | Delete a service |

### Booking Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Book a consultation |
| GET | `/api/bookings/client` | Get client's bookings |
| GET | `/api/bookings/lawyer` | Get lawyer's bookings |
| PATCH | `/api/bookings/:id/status` | Update booking status |

### Admin Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/verify/:id` | Verify a user |
| DELETE | `/api/admin/users/:id` | Remove a user |

### Document Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/generate` | Generate a legal document |
| GET | `/api/documents` | Get client's documents |

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Client** | Register, search services, book consultations, request documents |
| **Lawyer** | Create services, set pricing & availability, manage bookings |
| **Admin** | Verify users, manage platform, view all activity |

---

## 🔒 Environment Variables

### Backend `.env`
```env
PORT=5000
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Never commit your `.env` files to GitHub.** Make sure they are listed in `.gitignore`.

---

## ☁️ Deployment

### Frontend — Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL=your_backend_url`
5. Deploy ✅

### Backend — Render / Railway

1. Go to [render.com](https://render.com) or [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Add all environment variables
5. Deploy ✅

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature description"

# 4. Push to the branch
git push origin feature/your-feature-name

# 5. Open a Pull Request on GitHub
```

Please follow clean code practices and write meaningful commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

## 👩‍💻 Author

**Harsika Kumari**

[![GitHub](https://img.shields.io/badge/GitHub-HarsikaKumari-181717?style=flat&logo=github)](https://github.com/HarsikaKumari)

---

<div align="center">

Made with ❤️ and ⚖️ by Harsika Kumari

*"Access to justice, one click at a time."*

⭐ If you found this project helpful, please give it a star!

</div>

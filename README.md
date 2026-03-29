# CompScience University ERP

A complete **Full-Stack University ERP Web Application** featuring three distinct role-based portals (Student, Faculty, Admin). Build with **React + Tailwind CSS** on the frontend, and secured by a **Spring Boot + MongoDB** backend.

---

## 🚀 Getting Started

To run the application locally, you will need to start both the frontend development server and the backend Spring Boot server.

### 1. Start the Backend Server
Make sure you have Java 17+ installed. We use the wrapped local Maven to run the application.

```cmd
cd path/to/SARMS
cd server
apache-maven-3.9.6\bin\mvn spring-boot:run
```
The backend will run on `http://localhost:8080` and connect to the configured MongoDB Atlas cluster automatically. On its very first run, it will automatically seed the database with departments, users, courses, and timetables.

### 2. Start the Frontend Server
Open a new terminal window:

```cmd
cd path/to/SARMS
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Credentials & Authentication

The application is secured with **JWT (JSON Web Tokens)**. When the backend first boots, it seeds the database with realistic demo accounts.

| Role     | Example ID         | Password |
|----------|--------------------|----------|
| Student  | STUD-2022-001      | pass001  |
| Faculty  | FAC-001            | fac001   |
| Admin    | ADM-001            | adm001   |

> The authentication system includes secure password hashing, role-based database queries, and a fully functional route-guard system on the React router.

---

## 📁 Project Architecture

```
SARMS/
├── server/                   # Spring Boot Backend
│   ├── src/main/java/.../sarms/
│   │   ├── config/           # Security & CORS Config
│   │   ├── controller/       # REST API Endpoints
│   │   ├── model/            # MongoDB Document Entities (Student, Course, Marks, User)
│   │   ├── repository/       # MongoRepositories
│   │   ├── security/         # JWT Generation & Filter logic
│   │   ├── service/          # Business Logic (Grading, Enrollment, Profile management)
│   │   └── seed/             # Database initialization (DataSeeder)
│   └── src/main/resources/
│       └── application.properties # MongoDB URI, Port, JWT Secret
│
├── src/                      # React Frontend
│   ├── components/           # Reusable UI elements (Layout, Sidebar, Modal)
│   ├── context/              # AuthContext (Handles JWT interceptors)
│   ├── pages/
│   │   ├── admin/            # Course/Student Management, Uploading Results
│   │   ├── faculty/          # Marks Entry, Course Syllabus Editor
│   │   └── student/          # Registration, Academic Report, Timetable
│   └── services/
│       └── api.js            # Axios instance with Auto-JWT injection
└── package.json
```

---

## 🧩 Key System Features

### Student Course Enrollment
Students dynamically enroll in courses for the active semester. The backend algorithm guarantees database atomicity: adding the course to their `AcademicRecord` (as "In Progress"), creating empty gradebooks inside the `Marks` collection, and incrementing the course occupancy tracker concurrently.

### Mathematics & Grade Publishing
Faculty define custom assessment components (Midsem, Quizzes, Assignments). The frontend manages raw inputs against dynamically scaled dynamic component limits.
When the Admin clicks **Publish Results**, a backend orchestrator triggers:
1. Locks the Course and Marks Document so faculty can no longer edit grades.
2. Extracts raw marks and mathematically scales them exactly to 100%.
3. Maps final percentages into Letter Grades (A+, A, B) and calculates standard Grade Points (10, 9, 8).
4. Replaces the temporary "IP" placeholders in the Student's `AcademicRecord` and permanently recomputes their SGPA.

### Timetable & Dashboards
A completely dynamic grid-based GUI timetable displays lectures corresponding precisely to the logged-in user. Dashboards use `Recharts` to chart visual SGPA progression across multiple semesters.

---

## 🛠 Tech Stack

### Frontend
- **React 19** — Functional components + Hooks
- **Tailwind CSS 3** — Utility-first design system with custom brand tokens (Navy `#0A1F44` & Gold `#C9A84C`)
- **React Router v6** — Advanced nested routes and strict permission routing
- **Axios** — HTTP requests and response interceptors

### Backend
- **Java 17 + Spring Boot 3** — RESTful API architecture
- **Spring Security + JWT** — Stateless request authorization
- **MongoDB Atlas + Spring Data Mongo** — NoSQL flexible data storage

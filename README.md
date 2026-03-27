# CompScience University ERP

A complete, **frontend-only** University ERP Web Application built with **React + Tailwind CSS**. Features three role-based portals (Student, Faculty, Admin) with realistic mock data throughout.

---

## 🚀 Getting Started

```bash
# Navigate to the project directory
cd "path/to/SARMS_website"

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Demo Login Credentials

The application uses an in-memory simulated backend database (`/src/data/users.js`) with 10 generated users for each role.

| Role     | ID Range                   | Password Format |
|----------|----------------------------|-----------------|
| Student  | CS-2022-001 to CS-2022-010 | pass001         |
| Faculty  | FAC-001 to FAC-010         | fac001          |
| Admin    | ADM-001 to ADM-010         | adm001          |

> For security and clean UI purposes, there are no credential hints on the login page itself. Use any valid combination exactly matching the database.

---

## 📁 Folder Structure

```
src/
├── context/
│   └── AuthContext.jsx       # Auth state (currentUser, login, logout)
├── hooks/
│   └── useToast.js           # Toast notification queue
├── data/                     # All mock data (no API calls)
│   ├── credentials.js        # User login credentials
│   ├── courses.js            # All courses + grade mapping utility
│   ├── students.js           # 12 student profiles + academic records
│   ├── faculty.js            # Faculty profiles
│   ├── timetable.js          # Weekly schedule slots
│   └── marksManagement.js    # Grading components + student marks
├── components/               # Shared UI components
│   ├── Layout.jsx            # Sidebar + header shell + ToastContext
│   ├── Sidebar.jsx           # Role-aware nav (graduation cap logo)
│   ├── Header.jsx            # Top bar: avatar, role badge, logout
│   ├── Modal.jsx             # Reusable overlay modal
│   ├── Toast.jsx             # Toast notifications (success/error/info)
│   └── ProtectedRoute.jsx    # Role-based route guard
├── pages/
│   ├── LoginPage.jsx         # Clean minimal login form (hardcoded validation)
│   ├── student/
│   │   ├── Timetable.jsx          # Weekly grid (Mon–Sat, 8 AM–6 PM)
│   │   ├── CourseRegistration.jsx # Add/drop electives, credit counter
│   │   └── AcademicReport.jsx     # Grades, SGPA, CGPA, bar chart
│   ├── faculty/
│   │   ├── CourseManagement.jsx   # Course cards + edit modal
│   │   └── MarksManagement.jsx    # Grading components + marks table
│   └── admin/
│       ├── CourseOversight.jsx    # Master course table, create/edit
│       ├── StudentManagement.jsx  # Searchable table + profile editor
│       └── StudentRegistration.jsx # New student form + roll gen
└── App.jsx                   # React Router config
```

---

## 🎨 Design System

| Token       | Value     |
|-------------|-----------|
| Navy        | `#0A1F44` |
| Gold        | `#C9A84C` |
| Background  | `#F5F5F5` |
| Font        | Inter     |

---

## 🧩 Key Component Notes

### `Layout.jsx`
The main shell that wraps all authenticated pages. It renders the `<Sidebar>` and `<Header>`, then an `<Outlet>` for the active page. Also provides a `ToastContext` so any child page can call `useShowToast()` to display notifications without prop-drilling.

### `AuthContext.jsx`
Holds `currentUser` in state. `login(id, password)` validates against the mock credentials and sets the user. `logout()` clears it. No tokens or sessions — pure in-memory state.

### `Timetable.jsx`
Uses CSS Grid with absolute positioning to lay slots onto the time rows. Each slot spans rows proportionally by `startHour` and `endHour`. Click a slot to see full details.

### `MarksManagement.jsx`
Faculty first defines **grading components** (name + weight %). Weights must total 100%. Marks are then entered per student per component (each out of 100), and the system auto-calculates: `weighted_total = Σ (mark × weight/100)`. Past-semester courses are locked read-only.

### `AcademicReport.jsx`
Uses [Recharts](https://recharts.org) `BarChart` for the SGPA trend. The last semester bar is highlighted in gold. CGPA is derived by the `calculateCGPA()` utility from `students.js`.

### `StudentRegistration.jsx`
On submit, generates a roll number `CS-YYYY-XXX` using an in-memory counter per batch year. Shows a success card with a "Copy Roll Number" button.

---

## 🛠 Tech Stack

- **React 19** — functional components + hooks
- **Tailwind CSS 3** — all styling, custom navy/gold tokens
- **React Router v6** — nested routes, role-based redirects
- **Recharts** — SGPA bar chart
- **Lucide React** — icons throughout
- **Vite** — dev server + build tool

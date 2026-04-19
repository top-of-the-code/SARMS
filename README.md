# SARMS: Student Academic Records Management System

SARMS is a comprehensive **Full-Stack University ERP Web Application** designed to streamline academic operations. It features three distinct role-based portals (Student, Faculty, Admin) and handles everything from course registration to bulk result publishing and graduation workflows.

Built with **React + Tailwind CSS** on the frontend and a **Spring Boot + MongoDB** backend.

---

## 🚀 Getting Started

To run the application locally, you need to start both the backend Spring Boot server and the frontend Vite development server.

### Prerequisites
- **Java JDK 17** (Temurin is recommended)
- **Node.js** (v18+)
- **Chrome Browser** (for running Selenium tests)

### 1. Start the Backend Server
Navigate to the `server` directory and run the Spring Boot application using the bundled Maven:

```bash
cd server
# Ensure Java 17 is active
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"

# Run the server
./apache-maven-3.9.6/bin/mvn spring-boot:run
```
The backend will run on `http://localhost:8080`. It automatically connects to the MongoDB Atlas cluster and seeds initial data on its first run.

### 2. Start the Frontend Server
Open a new terminal and run:

```bash
# From project root
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Automated Testing

SARMS includes a **Selenium-based automated test suite** to verify critical user flows like login and dashboard access.

### Run tests:
```bash
cd server
# Ensure Java 17 is active
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
./apache-maven-3.9.6/bin/mvn test -Dtest=SarmsLoginTest
```
> [!NOTE]
> Make sure the Frontend server is running at `http://localhost:5173` before executing the Selenium tests.

---

## 🔐 Credentials & Authentication

The system uses **JWT (JSON Web Tokens)** for stateless authentication. Demo accounts are automatically seeded:

| Role     | Username        | Password      |
|----------|-----------------|---------------|
| Admin    | `ADM-001`       | `password123` |
| Faculty  | `FAC-ECE-001`   | `password123` |
| Student  | `STUD-2026-001` | `password123` |

---

## 📁 Project Architecture

```
SARMS/
├── server/                   # Spring Boot Backend
│   ├── src/main/java/        # Source code
│   ├── src/test/java/        # Selenium Automation Tests
│   ├── apache-maven-3.9.6/   # Bundled Maven binaries
│   └── pom.xml               # Backend dependencies (Spring, Selenium, JWT)
├── src/                      # React Frontend
│   ├── components/           # UI Design System
│   ├── pages/                # Role-based dashboards
│   └── services/             # API integration (Axios)
├── public/                   # Static assets
└── package.json              # Frontend dependencies
```

---

## 🧩 Key Features

- **Automated Enrollment**: New students are auto-enrolled in core courses based on their department.
- **Double Authentication**: Sensitive operations like "Bulk Publish Results" require a fresh login for security.
- **Dynamic Grading**: Mathematical scaling of assessment components (Midsem, Finals, Quizzes) into SGPA/CGPA.
- **Smart Promotion**: Automated semester promotion and graduation tracking.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Tailwind CSS 3, Vite, React Router 6, Recharts.
- **Backend**: Java 17, Spring Boot 3.2, Spring Security.
- **Database**: MongoDB Atlas.
- **Testing**: Selenium WebDriver, JUnit 5.

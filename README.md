<div align="center">

<br/>

```
███████╗ █████╗ ██████╗ ███╗   ███╗███████╗
██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝
███████╗███████║██████╔╝██╔████╔██║███████╗
╚════██║██╔══██║██╔══██╗██║╚██╔╝██║╚════██║
███████║██║  ██║██║  ██║██║ ╚═╝ ██║███████║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
```

### **Student Academic Records Management System**

*A production-grade university ERP — engineered end-to-end through the full Waterfall SDLC,*
*from formal SRS and UML artifacts to implementation and E2E test coverage.*

<br/>

[![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)](.)
[![Java](https://img.shields.io/badge/java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](.)
[![Spring Boot](https://img.shields.io/badge/spring_boot-3.2-6DB33F?style=flat-square&logo=springboot&logoColor=white)](.)
[![React](https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=black)](.)
[![MongoDB](https://img.shields.io/badge/mongodb-atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](.)
[![Tailwind CSS](https://img.shields.io/badge/tailwind_css-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](.)
[![JWT](https://img.shields.io/badge/JWT-stateless_auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](.)
[![Selenium](https://img.shields.io/badge/selenium-E2E_tests-43B02A?style=flat-square&logo=selenium&logoColor=white)](.)

</div>

---

## Overview

SARMS is not a tutorial-grade CRUD app. It's a full-stack university ERP that simulates real institutional workflows — automated semester promotion, graduation detection, credit-capped registration, and configurable academic terms — all secured behind stateless JWT authentication and role-isolated portals.

Built by a four-person team following the **Waterfall Model**, with formal SRS documentation, DFD models, UML class and sequence diagrams produced before a single line of code was written.

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Engineering Decisions](#engineering-decisions)
- [Software Engineering Artifacts](#software-engineering-artifacts)
- [Development Lifecycle](#development-lifecycle)
- [Getting Started](#getting-started)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)

---

## Key Features

| Feature | Description |
|---|---|
| **Three Role-Based Portals** | Isolated dashboards for Admin, Faculty, and Student — each with discrete permissions and UI. |
| **Stateless JWT Authentication** | HMAC-SHA256 signed tokens with role-based endpoint guarding via Spring Security. |
| **One-Click Result Engine** | Bulk grade finalization, SGPA/CGPA recomputation, and semester promotion in a single atomic operation. |
| **Auto-Enrollment Pipeline** | Students are automatically enrolled in next-semester core courses upon result publication. |
| **Graduation Detection** | Students completing semester 8 are automatically marked as graduated and deactivated. |
| **Double Authentication** | Destructive admin operations require real-time credential re-verification — not just a dialog box. |
| **Configurable Academic Clock** | Admin-controlled Monsoon/Spring term system governing course visibility and registration windows. |
| **Credit-Capped Registration** | Hard 25-credit ceiling with live tracking of core vs. elective allocation. |
| **Flexible Grading Engine** | Supports weighted components, "Best N of M" quiz policies, and automatic percentage-to-grade mapping. |
| **Self-Service Password Reset** | Two-step forgot-password flow with ID verification and BCrypt re-hashing. |

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19 · Tailwind CSS 3 · Vite · React Router 6 · Recharts · Axios |
| **Backend** | Java 17 · Spring Boot 3.2 · Spring Security · Spring Data MongoDB |
| **Auth** | JWT (jjwt 0.12) · BCrypt · Stateless sessions · Per-request token filter |
| **Database** | MongoDB Atlas (cloud NoSQL) |
| **Testing** | Selenium WebDriver + JUnit 5 · Playwright |
| **API Docs** | Springdoc OpenAPI / Swagger UI |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React SPA (Vite)                    │
│         Admin Portal │ Faculty Portal │ Student Portal  │
└──────────────────────────┬──────────────────────────────┘
                           │ REST (Axios + JWT Bearer)
┌──────────────────────────▼──────────────────────────────┐
│                  Spring Boot Backend                    │
│                                                         │
│  JwtAuthFilter → Controller → Service → Repository      │
│                                    │                    │
│                          Spring Security Context        │
└──────────────────────────┬──────────────────────────────┘
                           │ Spring Data MongoDB
┌──────────────────────────▼──────────────────────────────┐
│                     MongoDB Atlas                       │
│   users · courses · enrollments · marks · semesters     │
└─────────────────────────────────────────────────────────┘
```

Every request passes through a custom `JwtAuthFilter` that validates the token and injects the user's identity and role into the Spring Security context. The backend follows strict **Controller → Service → Repository** layering, with repositories mapping directly to MongoDB Atlas collections.

---

## Engineering Decisions

These design choices reflect real-world institutional complexity — not textbook patterns.

**Double Authentication for Critical Operations**
Publishing results and wiping student data require the admin to re-enter credentials at the point of action, verified server-side against the BCrypt hash. No frontend confirmation dialog alone.

**Automated Semester Lifecycle Engine**
A single "Upload Results" action atomically: finalizes grades for all enrolled students → recomputes SGPA → promotes to next semester → auto-enrolls in department-specific core courses → shifts the global academic term. One transactional flow.

**Automatic Graduation Detection**
Students completing semester 8 are programmatically marked inactive. Accounts remain accessible for transcript viewing but are locked out of registration and course workflows.

**Configurable Monsoon/Spring Academic Clock**
The admin shifts the university's active term between Monsoon (odd semesters) and Spring (even semesters). This controls course catalog visibility, determines which student batches can register, and enforces semester-type parity rules.

**Credit-Capped Registration with Core Locking**
Core departmental courses are pre-enrolled and locked. Students modify only elective selections within a hard 25-credit ceiling, with real-time visual feedback on remaining capacity.

**"Best N of M" Grading Policy**
Faculty can define policies like "Best 3 of 5 quizzes" — the engine automatically selects top scores and scales them during grade computation.

**Idempotent Database Seeding**
`DataSeeder` checks for existing data before inserting, making it safe to restart the server repeatedly without duplication. It also force-syncs all user passwords on every boot to ensure cross-JDK BCrypt compatibility.

**Full System Reset with Selective Preservation**
The admin "Wipe" action (requiring typed confirmation) deletes all student accounts, enrollments, and marks while preserving the course catalog, faculty records, and grading configurations — designed for clean end-of-year resets.

**Stateless Architecture**
No session cookies. No server-side session stores. The entire auth layer is stateless — horizontal scaling requires zero session affinity.

---

## Software Engineering Artifacts

Produced during the formal SDLC phases before implementation began:

| Document | Description |
|---|---|
| [**SRS Document**](docs/SRS%20Documentation.pdf) | Complete functional and non-functional requirements specification. |
| [**DFD Model & Data Dictionary**](docs/DFD%20Model%20and%20Data%20Dictionary%20Documentation.pdf) | Level 0 & Level 1 data flow diagrams with formal definitions of all data elements and constraints. |
| [**Use Case Document**](docs/Use%20Case%20Documentation.pdf) | Actor-driven use case specifications for all system interactions. |
| [**Class Diagram**](docs/Class%20Diagram%20Documentation.pdf) | UML class diagram mapping entities, relationships, and service boundaries. |
| [**Sequence Diagram**](docs/Sequence%20Diagram%20Documentation.pdf) | Interaction diagrams for critical flows including authentication and result publishing. |

---

## Development Lifecycle

This project followed the **Waterfall Model** through a complete SDLC:

```
Requirement Analysis → System Design → Implementation → Testing
        │                    │               │              │
      SRS +               DFD / UML       React +        Selenium
   stakeholder           artifacts      Spring Boot     WebDriver +
   interviews                                           Playwright
```

Each phase produced formal deliverables. The sequential approach locked design decisions before code was written, yielding a stable, well-documented system with traceable requirements.

---

## Getting Started

<details>
<summary><strong>Prerequisites</strong></summary>

- Java 17
- Node.js 18+
- Maven 3.9+
- A MongoDB Atlas cluster (free tier works)

</details>

### 1. Clone

```bash
git clone https://github.com/AryanRastogi7/SARMS.git
cd SARMS
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```dotenv
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/sarms_db?retryWrites=true&w=majority
JWT_SECRET=<a-long-random-string-for-HMAC-SHA256>
```

### 3. Start the Backend

<details>
<summary><strong>Windows (PowerShell)</strong></summary>

```powershell
cd backend
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
apache-maven-3.9.6\bin\mvn clean compile spring-boot:run
```

</details>

<details>
<summary><strong>macOS / Linux</strong></summary>

```bash
cd backend
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
./apache-maven-3.9.6/bin/mvn clean compile spring-boot:run
```

</details>

Wait for `Started SarmsApplication in X seconds`. API is live at `http://localhost:8080`.

Swagger UI available at: `http://localhost:8080/swagger-ui.html`

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

App is live at `http://localhost:5173`.

---

## Future Enhancements

- [ ] **Email Notifications** — Registration confirmation and password reset via email
- [ ] **Attendance Tracking** — Faculty-managed per-course attendance
- [ ] **Course Feedback System** — End-of-semester student ratings
- [ ] **Analytics Dashboard** — Department-wide performance, pass/fail ratios, enrollment trends
- [ ] **Elective Bidding** — Priority-based allocation for limited-seat courses
- [ ] **Docker Compose** — One-command deployment with containerized services
- [ ] **CI/CD Pipeline** — Automated testing and deployment via GitHub Actions
- [ ] **Audit Logging** — Immutable trail of all grade modifications and admin actions

---

## Contributors

<table>
  <tr>
    <td align="center"><a href="https://github.com/AryanRastogi72"><b>Aryan Rastogi</b></a></td>
    <td align="center"><a href="https://github.com/Chhayank19"><b>Chhayank Gupta</b></a></td>
    <td align="center"><a href="https://github.com"><b>Ridhima Garg</b></a></td>
    <td align="center"><a href="https://github.com/top-of-the-code"><b>Muskan Saxena</b></a></td>
  </tr>
</table>

---

<div align="center">

Built with ☕ Java + ⚛️ React

</div>

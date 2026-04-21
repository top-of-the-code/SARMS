<p align="center">
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/spring_boot-3.2-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/mongodb-atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/tailwind_css-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/JWT-stateless_auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/selenium-E2E_tests-43B02A?style=flat-square&logo=selenium&logoColor=white" alt="Selenium" />
</p>

<h1 align="center">SARMS</h1>
<p align="center">
  <strong>Student Academic Records Management System</strong><br/><br/>
  A production-grade university ERP built with React and Spring Boot, developed through a 
  complete Software Development Life Cycle following the Waterfall Model — from SRS and UML 
  design artifacts through to implementation and E2E testing. Features stateless JWT 
  authentication, automated semester lifecycle management, and role-isolated portals for 
  Admins, Faculty, and Students — going well beyond CRUD to simulate real institutional workflows.
</p>

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [What Makes This Project Special](#-what-makes-this-project-special)
- [Software Engineering Artifacts](#-software-engineering-artifacts)
- [Development Lifecycle](#-development-lifecycle)
- [Future Enhancements](#-future-enhancements)
- [How to Run Locally](#%EF%B8%8F-how-to-run-locally)
- [Contributors](#-contributors)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Three Role-Based Portals** | Isolated dashboards for Admin, Faculty, and Student — each with discrete permissions and UI. |
| **Stateless JWT Authentication** | HMAC-SHA256 signed tokens with role-based endpoint guarding via Spring Security. |
| **One-Click Result Engine** | Bulk grade finalization, SGPA/CGPA recomputation, and semester promotion in a single atomic operation. |
| **Auto-Enrollment Pipeline** | Students are automatically enrolled in next-semester core courses upon result publication. |
| **Graduation Detection** | Students completing semester 8 are automatically marked as graduated and deactivated. |
| **Double Authentication** | Destructive admin operations (result publishing, data wipes) require real-time credential re-verification. |
| **Configurable Academic Clock** | Admin-controlled Monsoon/Spring term system that governs course visibility and registration windows. |
| **Credit-Capped Registration** | Enforced 25-credit ceiling with live tracking of core vs. elective allocation. |
| **Flexible Grading Engine** | Supports weighted components, "Best N of M" quiz policies, and automatic percentage-to-grade mapping. |
| **Self-Service Password Reset** | Two-step forgot-password flow with ID verification and BCrypt re-hashing. |

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19 · Tailwind CSS 3 · Vite · React Router 6 · Recharts · Axios |
| **Backend** | Java 17 · Spring Boot 3.2 · Spring Security · Spring Data MongoDB |
| **Auth** | JWT (jjwt 0.12) · BCrypt · Stateless sessions · Per-request token filter |
| **Database** | MongoDB Atlas (cloud NoSQL) |
| **Testing** | Selenium WebDriver + JUnit 5 · Playwright |
| **API Docs** | Springdoc OpenAPI / Swagger UI |

---

## 🏗 Architecture

The frontend is a React SPA that communicates with the Spring Boot backend exclusively through REST APIs. Every request passes through a custom `JwtAuthFilter` that validates the token and injects the user's identity and role into the Spring Security context. The backend follows a clean **Controller → Service → Repository** layering, with repositories mapping directly to MongoDB Atlas collections.

---

## 🔬 What Makes This Project Special

This isn't a tutorial-grade CRUD app. The following design decisions reflect real-world institutional complexity:

- **Double Authentication for Critical Operations** — Publishing results and wiping student data require the admin to re-enter credentials at the point of action, verified server-side against the BCrypt hash — not just a frontend confirmation dialog.

- **Automated Semester Lifecycle Engine** — A single "Upload Results" action atomically finalizes grades for all enrolled students, recomputes their SGPA, promotes them to the next semester, auto-enrolls them in department-specific core courses, and shifts the global academic term — all in one transactional flow.

- **Automatic Graduation Detection** — Students who complete semester 8 are programmatically marked as inactive (graduated). Their accounts remain accessible for transcript viewing but are locked out of registration and course workflows.

- **Configurable Monsoon/Spring Academic Clock** — The admin can shift the university's active term between Monsoon (odd semesters) and Spring (even semesters). This controls which courses appear in the catalog, which student batches can register, and enforces semester-type parity rules (e.g., Monsoon courses cannot be assigned to even semesters).

- **Credit-Capped Registration with Core Locking** — Core departmental courses are pre-enrolled and locked; students can only modify elective selections within a hard 25-credit ceiling, with real-time visual feedback on remaining capacity.

- **"Best N of M" Grading Policy** — The marks engine supports flexible grading components where faculty can define policies like "Best 3 of 5 quizzes" — the system automatically selects the top scores and scales them during grade computation.

- **Idempotent Database Seeding** — The `DataSeeder` checks for existing data before inserting, making it safe to restart the server any number of times without data duplication. It also force-syncs all user passwords on every boot to ensure cross-JDK BCrypt compatibility.

- **Full System Reset with Selective Preservation** — The admin "Wipe" action (requiring typed confirmation) deletes all student accounts, enrollments, and marks while safely preserving the course catalog, faculty records, and grading configurations — designed for end-of-year resets.

- **Stateless Architecture, Zero Server-Side Sessions** — The entire auth layer is stateless. No session cookies, no server-side session stores. Horizontal scaling requires zero session affinity.

---

## 📐 Software Engineering Artifacts

The following design documents were produced as part of the formal software engineering process:

| Document | Description | Link |
|---|---|---|
| **SRS Document** | Complete functional and non-functional requirements specification. | [View Document](docs/SRS%20Documentation.pdf) |
| **DFD Model & Data Dictionary** | Data flow diagrams (Level 0 & Level 1) with formal definitions of all data elements and constraints. | [View Document](docs/DFD%20Model%20and%20Data%20Dictionary%20Documentation.pdf) |
| **Use Case Document** | Actor-driven use case specifications for all system interactions. | [View Document](docs/Use%20Case%20Documentation.pdf) |
| **Class Diagram** | UML class diagram mapping entities, relationships, and service boundaries. | [View Document](docs/Class%20Diagram%20Documentation.pdf) |
| **Sequence Diagram** | Interaction diagrams for critical flows including authentication and result publishing. | [View Document](docs/Sequence%20Diagram%20Documentation.pdf) |

---

## 🔄 Development Lifecycle

This project was developed following the **Waterfall Model** as part of a complete Software Development Life Cycle (SDLC):

**Requirement Analysis** → **System Design** → **Implementation** → **Testing**

Each phase produced formal deliverables — from the SRS and DFD models during analysis and design, to the full-stack implementation in React and Spring Boot, to end-to-end validation using Selenium WebDriver and Playwright. The sequential approach ensured that design decisions were locked before code was written, resulting in a stable and well-documented system.

---

## 🔮 Future Enhancements

- [ ] **Email Notifications** — Registration confirmation and password reset via email
- [ ] **Attendance Tracking** — Faculty-managed per-course attendance
- [ ] **Course Feedback System** — End-of-semester student ratings
- [ ] **Analytics Dashboard** — Department-wise performance, pass/fail ratios, enrollment trends
- [ ] **Elective Bidding** — Priority-based allocation for limited-seat courses
- [ ] **Docker Compose** — One-command deployment with containerized services
- [ ] **CI/CD Pipeline** — Automated testing and deployment via GitHub Actions
- [ ] **Audit Logging** — Immutable trail of all grade modifications and admin actions

---

<details>
<summary><strong>⚙️ How to Run Locally</strong></summary>

### 1. Clone the repository

```bash
git clone https://github.com/AryanRastogi7/SARMS.git
cd SARMS
```

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and fill in your credentials:

```dotenv
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/sarms_db?retryWrites=true&w=majority
JWT_SECRET=<a-long-random-string-for-HMAC-SHA256>
```

### 3. Start the Backend (Spring Boot)

**Windows (PowerShell):**
```powershell
cd backend
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
apache-maven-3.9.6\bin\mvn clean compile spring-boot:run
```

**macOS / Linux:**
```bash
cd backend
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
./apache-maven-3.9.6/bin/mvn clean compile spring-boot:run
```

Wait for `Started SarmsApplication in X seconds`. The API is live at `http://localhost:8080`.

### 4. Start the Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The app is live at `http://localhost:5173`.

</details>

---

## 👥 Contributors

<table>
  <tr>
    <td align="center"><a href="https://github.com/AryanRastogi72"><strong>Aryan Rastogi</strong></a></td>
    <td align="center"><a href="https://github.com"><strong>Chhayank Gupta</strong></td>
    <td align="center"><a href="https://github.com"><strong>Ridhima Garg</strong></td>
    <td align="center"><a href="https://github.com"><strong>Muskan Saxena</strong></td>
  </tr>
</table>

---

<p align="center">
  Built with ☕ Java + ⚛️ React
</p>

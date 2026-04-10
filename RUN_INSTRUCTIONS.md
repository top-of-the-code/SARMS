# How to Run SARMS Locally

To run the Student Academic Records Management System (SARMS) on your own machine, follow these instructions.

## Prerequisites
- **Node.js** (v18+ recommended) — for the frontend
- **Java JDK 17** (Temurin/AdoptOpenJDK recommended) — for the backend
- **MongoDB** — the backend connects to a cloud Atlas instance (already configured)

---

## 1. Start the Backend Server (Spring Boot)

1. Open your terminal.
2. Navigate to the backend directory:
   ```bash
   cd ~/Desktop/sarms/SARMS/server
   ```
3. **Important:** Set your Java version to JDK 17. The project will not compile with Java 24+.
   ```bash
   export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
   export PATH="$JAVA_HOME/bin:$PATH"
   ```
4. Run the Spring Boot application:
   ```bash
   ./apache-maven-3.9.6/bin/mvn clean compile spring-boot:run
   ```
5. Wait until you see: `Started SarmsApplication in X seconds`
6. The backend API will be available at **http://localhost:8080**

---

## 2. Start the Frontend Application (React + Vite)

1. Open a **new, separate terminal window**.
2. Navigate to the project root:
   ```bash
   cd ~/Desktop/sarms/SARMS
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. The frontend will start on the URL shown in the terminal (usually **http://localhost:5173/**)

---

## 3. Access SARMS

Open your web browser and go to the frontend URL printed by Vite.

### Login Credentials

All accounts use the password: `password123`

| Role    | User ID         | Name                  |
|---------|-----------------|-----------------------|
| Admin   | `ADM-001`       | System Administrator  |
| Faculty | `FAC-ECE-001`   | Dr. Homi J. Bhabha    |
| Faculty | `FAC-ECE-002`   | Dr. C. V. Raman       |
| Faculty | `FAC-ME-006`    | Dr. M. Visvesvaraya   |

> **Note:** Student accounts are created through the Admin portal's "Student Registration" page. Once registered, students can log in with their assigned Roll Number (e.g. `STUD-2026-001`) and password `password123`.

---

## Quick Start (Copy-Paste)

**Terminal 1 — Backend:**
```bash
cd ~/Desktop/sarms/SARMS/server
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
./apache-maven-3.9.6/bin/mvn clean compile spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd ~/Desktop/sarms/SARMS
npm run dev
```

Then open **http://localhost:5173/** in your browser.

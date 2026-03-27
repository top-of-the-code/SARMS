import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// ── Pages ─────────────────────────────────────────────────────
import LoginPage from './pages/LoginPage';

// Student portal
import Timetable        from './pages/student/Timetable';
import CourseRegistration from './pages/student/CourseRegistration';
import AcademicReport   from './pages/student/AcademicReport';

// Faculty portal
import CourseManagement from './pages/faculty/CourseManagement';
import MarksManagement  from './pages/faculty/MarksManagement';

// Admin portal
import CourseOversight      from './pages/admin/CourseOversight';
import StudentManagement    from './pages/admin/StudentManagement';
import StudentRegistration  from './pages/admin/StudentRegistration';

/**
 * App — top-level router.
 * All authenticated portals are wrapped in Layout (sidebar + header).
 * ProtectedRoute enforces role-based access.
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public: Login ─────────────────────────────── */}
          <Route path="/" element={<LoginPage />} />

          {/* ── Student Portal ────────────────────────────── */}
          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="student">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="timetable" replace />} />
            <Route path="timetable"    element={<Timetable />} />
            <Route path="registration" element={<CourseRegistration />} />
            <Route path="report"       element={<AcademicReport />} />
          </Route>

          {/* ── Faculty Portal ────────────────────────────── */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute requiredRole="faculty">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="marks"   element={<MarksManagement />} />
          </Route>

          {/* ── Admin Portal ──────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses"  element={<CourseOversight />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="register" element={<StudentRegistration />} />
          </Route>

          {/* ── Catch-all ─────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

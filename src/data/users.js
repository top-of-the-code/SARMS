export const USERS = [
  // ── Students (10) ──
  { id: 'CS-2022-001', password: 'pass001', role: 'student', name: 'Aarav Sharma' },
  { id: 'CS-2022-002', password: 'pass002', role: 'student', name: 'Priya Nair' },
  { id: 'CS-2022-003', password: 'pass003', role: 'student', name: 'Rohan Mehta' },
  { id: 'CS-2022-004', password: 'pass004', role: 'student', name: 'Sneha Patel' },
  { id: 'CS-2022-005', password: 'pass005', role: 'student', name: 'Kiran Verma' },
  { id: 'CS-2022-006', password: 'pass006', role: 'student', name: 'Anjali Singh' },
  { id: 'CS-2022-007', password: 'pass007', role: 'student', name: 'Dev Kapoor' },
  { id: 'CS-2022-008', password: 'pass008', role: 'student', name: 'Meera Joshi' },
  { id: 'CS-2022-009', password: 'pass009', role: 'student', name: 'Arjun Rao' },
  { id: 'CS-2022-010', password: 'pass010', role: 'student', name: 'Ishaan Gupta' },

  // ── Faculty (10) ──
  { id: 'FAC-001', password: 'fac001', role: 'faculty', name: 'Dr. Pooja Singh' },
  { id: 'FAC-002', password: 'fac002', role: 'faculty', name: 'Prof. Ankit Sharma' },
  { id: 'FAC-003', password: 'fac003', role: 'faculty', name: 'Dr. Vikram Dutta' },
  { id: 'FAC-004', password: 'fac004', role: 'faculty', name: 'Prof. Neha Gupta' },
  { id: 'FAC-005', password: 'fac005', role: 'faculty', name: 'Dr. Ramesh Iyer' },
  { id: 'FAC-006', password: 'fac006', role: 'faculty', name: 'Prof. Sunita Reddy' },
  { id: 'FAC-007', password: 'fac007', role: 'faculty', name: 'Dr. Amit Bansal' },
  { id: 'FAC-008', password: 'fac008', role: 'faculty', name: 'Prof. Kavita Menon' },
  { id: 'FAC-009', password: 'fac009', role: 'faculty', name: 'Dr. Sanjay Kapoor' },
  { id: 'FAC-010', password: 'fac010', role: 'faculty', name: 'Prof. Meenakshi Venkat' },

  // ── Admin (10) ──
  { id: 'ADM-001', password: 'adm001', role: 'admin', name: 'Admin Registrar' },
  { id: 'ADM-002', password: 'adm002', role: 'admin', name: 'Dept. Coordinator' },
  { id: 'ADM-003', password: 'adm003', role: 'admin', name: 'Systems Administrator' },
  { id: 'ADM-004', password: 'adm004', role: 'admin', name: 'IT Support Team' },
  { id: 'ADM-005', password: 'adm005', role: 'admin', name: 'Library Head' },
  { id: 'ADM-006', password: 'adm006', role: 'admin', name: 'Hostel Manager' },
  { id: 'ADM-007', password: 'adm007', role: 'admin', name: 'Finance Controller' },
  { id: 'ADM-008', password: 'adm008', role: 'admin', name: 'Exam Controller' },
  { id: 'ADM-009', password: 'adm009', role: 'admin', name: 'Admissions Head' },
  { id: 'ADM-010', password: 'adm010', role: 'admin', name: 'Security Chief' },
];

/**
 * Validates login credentials.
 * Returns the matching user object or null if not found.
 */
export function validateCredentials(id, password) {
  return USERS.find(c => c.id === id && c.password === password) || null;
}

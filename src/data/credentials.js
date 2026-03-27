// Mock credentials for all users
// Format: { id, password, role, name }
// Students use roll numbers as their login ID

export const CREDENTIALS = [
  // ── Students ──
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
  { id: 'CS-2022-011', password: 'pass011', role: 'student', name: 'Tanvi Desai' },
  { id: 'CS-2022-012', password: 'pass012', role: 'student', name: 'Rahul Bose' },

  // ── Faculty ──
  { id: 'FAC-001', password: 'fac001', role: 'faculty', name: 'Dr. Pooja Singh' },
  { id: 'FAC-002', password: 'fac002', role: 'faculty', name: 'Prof. Ankit Sharma' },

  // ── Admin ──
  { id: 'ADM-001', password: 'adm001', role: 'admin', name: 'Admin Registrar' },
  { id: 'ADM-002', password: 'adm002', role: 'admin', name: 'Dept. Coordinator' },
];

/**
 * Validates login credentials.
 * Returns the matching user object or null if not found.
 */
export function validateCredentials(id, password) {
  return CREDENTIALS.find(c => c.id === id && c.password === password) || null;
}

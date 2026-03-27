// Faculty profiles and their course assignments
// FAC-001 → Dr. Pooja Singh (teaches OS, DBMS, CN)
// FAC-002 → Prof. Ankit Sharma (teaches DS, Algorithms, AI)

export const FACULTY = [
  {
    id: 'FAC-001',
    name: 'Dr. Pooja Singh',
    designation: 'Associate Professor',
    department: 'Computer Science',
    email: 'pooja.singh@compscience.edu',
    phone: '+91 98860 42345',
    specialization: 'Operating Systems & Networks',
    joinYear: 2015,
  },
  {
    id: 'FAC-002',
    name: 'Prof. Ankit Sharma',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    email: 'ankit.sharma@compscience.edu',
    phone: '+91 98765 11234',
    specialization: 'Algorithms & Artificial Intelligence',
    joinYear: 2019,
  },
];

/**
 * Returns a faculty member by their ID.
 */
export function getFacultyById(id) {
  return FACULTY.find(f => f.id === id) || null;
}

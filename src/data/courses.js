// All courses across all semesters for B.Tech CS program
// type: 'Compulsory' | 'Elective'
// status: 'Active' | 'Inactive'
// activeSemester: true = current running semester

export const COURSES = [
  // ── Semester 1 ──
  {
    code: 'CS101', name: 'Mathematics I', credits: 4, semester: 1, semesterType: 'Monsoon', year: 2024,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 60, status: 'Inactive',
    activeSemester: false,
    description: 'Calculus, linear algebra, and discrete mathematics foundations.',
    syllabusTopics: ['Limits & Derivatives', 'Matrices', 'Set Theory', 'Logic & Proofs'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CS102', name: 'Programming Fundamentals', credits: 4, semester: 1, semesterType: 'Monsoon', year: 2024,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 60, status: 'Inactive',
    activeSemester: false,
    description: 'Introduction to programming using C and Python.',
    syllabusTopics: ['Variables & Types', 'Loops & Functions', 'Arrays', 'Pointers'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CS103', name: 'Digital Logic Design', credits: 3, semester: 1, semesterType: 'Monsoon', year: 2024,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 60, status: 'Inactive',
    activeSemester: false,
    description: 'Boolean algebra, logic gates, and combinational circuits.',
    syllabusTopics: ['Boolean Algebra', 'Logic Gates', 'Flip-Flops', 'State Machines'],
    gradedComponents: [], resultsPublished: false,
  },

  // ── Semester 2 ──
  {
    code: 'CS201', name: 'Data Structures', credits: 4, semester: 2, semesterType: 'Spring', year: 2025,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 58, status: 'Inactive',
    activeSemester: false,
    description: 'Arrays, linked lists, stacks, queues, trees, and graphs.',
    syllabusTopics: ['Arrays & Lists', 'Stacks & Queues', 'Trees', 'Graphs', 'Hashing'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CS202', name: 'Mathematics II', credits: 4, semester: 2, semesterType: 'Spring', year: 2025,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 58, status: 'Inactive',
    activeSemester: false,
    description: 'Probability, statistics, and numerical methods.',
    syllabusTopics: ['Probability Theory', 'Statistics', 'Random Variables', 'Numerical Methods'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CS203', name: 'Object-Oriented Programming', credits: 3, semester: 2, semesterType: 'Spring', year: 2025,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 58, status: 'Inactive',
    activeSemester: false,
    description: 'OOP principles using Java — classes, inheritance, polymorphism.',
    syllabusTopics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Interfaces', 'Exception Handling'],
    gradedComponents: [], resultsPublished: false,
  },

  // ── Semester 3 ──
  {
    code: 'CS301', name: 'Operating Systems', credits: 4, semester: 3, semesterType: 'Monsoon', year: 2025,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 55, status: 'Inactive',
    activeSemester: false,
    description: 'Process management, memory, file systems, and I/O.',
    syllabusTopics: ['Process Scheduling', 'Memory Management', 'File Systems', 'Deadlocks', 'Virtual Memory'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, semester: 3, semesterType: 'Monsoon', year: 2025,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 55, status: 'Inactive',
    activeSemester: false,
    description: 'Algorithm design paradigms: greedy, divide & conquer, dynamic programming.',
    syllabusTopics: ['Greedy Algorithms', 'Divide & Conquer', 'Dynamic Programming', 'NP-Completeness'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CS303', name: 'Computer Networks', credits: 3, semester: 3, semesterType: 'Monsoon', year: 2025,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 55, status: 'Inactive',
    activeSemester: false,
    description: 'OSI model, TCP/IP, routing, switching and application protocols.',
    syllabusTopics: ['OSI Model', 'TCP/IP', 'Routing', 'DNS & HTTP', 'Network Security'],
    gradedComponents: [], resultsPublished: false,
  },

  // ── Semester 4 (current active semester) ──
  {
    code: 'CS401', name: 'Database Management Systems', credits: 4, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 52, status: 'Active',
    activeSemester: true,
    description: 'Relational model, SQL, normalization, transactions, and indexing.',
    syllabusTopics: ['Relational Model', 'SQL Queries', 'ER Diagrams', 'Normalization', 'Transactions', 'Indexing'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CS402', name: 'Software Engineering', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 52, status: 'Active',
    activeSemester: true,
    description: 'SDLC, agile methodologies, testing, and project management.',
    syllabusTopics: ['SDLC Models', 'Agile & Scrum', 'Requirements Engineering', 'Testing', 'Project Management'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CS403', name: 'Artificial Intelligence', credits: 4, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'CS', enrolled: 52, status: 'Active',
    activeSemester: true,
    description: 'Search algorithms, knowledge representation, machine learning intro.',
    syllabusTopics: ['Search Algorithms', 'CSP', 'Bayesian Networks', 'ML Basics', 'Neural Networks Intro'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CS404E', name: 'Web Development', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Elective', category: 'majorElective', department: 'CS', enrolled: 30, status: 'Active',
    activeSemester: true,
    description: 'HTML, CSS, JavaScript, React, and RESTful API design.',
    syllabusTopics: ['HTML/CSS Fundamentals', 'JavaScript ES6+', 'React Basics', 'REST APIs', 'Deployment'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CS405E', name: 'Cloud Computing', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Elective', category: 'majorElective', department: 'CS', enrolled: 22, status: 'Active',
    activeSemester: true,
    description: 'Cloud service models, virtualization, AWS/GCP fundamentals.',
    syllabusTopics: ['Cloud Models (IaaS/PaaS/SaaS)', 'Virtualization', 'AWS Basics', 'Containers & Docker', 'Serverless'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CS406E', name: 'Cyber Security', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Elective', category: 'majorElective', department: 'CS', enrolled: 18, status: 'Active',
    activeSemester: true,
    description: 'Cryptography, network security, ethical hacking fundamentals.',
    syllabusTopics: ['Cryptography', 'Firewalls & IDS', 'Web Security', 'Ethical Hacking', 'Digital Forensics'],
    gradedComponents: [], resultsPublished: false,
  },
];

/**
 * Grade mapping from total percentage to letter grade and grade points (10-point scale)
 */
export function getGrade(totalPercent) {
  if (totalPercent >= 90) return { letter: 'A+', points: 10 };
  if (totalPercent >= 80) return { letter: 'A',  points: 9 };
  if (totalPercent >= 70) return { letter: 'B+', points: 8 };
  if (totalPercent >= 60) return { letter: 'B',  points: 7 };
  if (totalPercent >= 50) return { letter: 'C',  points: 6 };
  if (totalPercent >= 40) return { letter: 'D',  points: 5 };
  return { letter: 'F', points: 0 };
}

/**
 * Returns courses for a specific semester
 */
export function getCoursesBySemester(semester) {
  return COURSES.filter(c => c.semester === semester);
}

/**
 * Returns courses taught by a specific faculty
 */
export function getCoursesByFaculty(facultyId) {
  return COURSES.filter(c => c.facultyId === facultyId);
}

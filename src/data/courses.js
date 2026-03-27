export const COURSES = [
  // ── Semester 1 ──
  {
    code: 'CSC101', name: 'Mathematics I', credits: 4, semester: 1, semesterType: 'Monsoon', year: 2024,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 60, status: 'Inactive',
    activeSemester: false,
    description: 'Calculus, linear algebra, and discrete mathematics foundations.',
    syllabusTopics: ['Limits & Derivatives', 'Matrices', 'Set Theory', 'Logic & Proofs'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CSC102', name: 'Programming Fundamentals', credits: 4, semester: 1, semesterType: 'Monsoon', year: 2024,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 60, status: 'Inactive',
    activeSemester: false,
    description: 'Introduction to programming using C and Python.',
    syllabusTopics: ['Variables & Types', 'Loops & Functions', 'Arrays', 'Pointers'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CSC103', name: 'Digital Logic Design', credits: 3, semester: 1, semesterType: 'Monsoon', year: 2024,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 60, status: 'Inactive',
    activeSemester: false,
    description: 'Boolean algebra, logic gates, and combinational circuits.',
    syllabusTopics: ['Boolean Algebra', 'Logic Gates', 'Flip-Flops', 'State Machines'],
    gradedComponents: [], resultsPublished: false,
  },

  // ── Semester 2 ──
  {
    code: 'CSC201', name: 'Data Structures', credits: 4, semester: 2, semesterType: 'Spring', year: 2025,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 58, status: 'Inactive',
    activeSemester: false,
    description: 'Arrays, linked lists, stacks, queues, trees, and graphs.',
    syllabusTopics: ['Arrays & Lists', 'Stacks & Queues', 'Trees', 'Graphs', 'Hashing'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CSC202', name: 'Mathematics II', credits: 4, semester: 2, semesterType: 'Spring', year: 2025,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 58, status: 'Inactive',
    activeSemester: false,
    description: 'Probability, statistics, and numerical methods.',
    syllabusTopics: ['Probability Theory', 'Statistics', 'Random Variables', 'Numerical Methods'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CSC203', name: 'Object-Oriented Programming', credits: 3, semester: 2, semesterType: 'Spring', year: 2025,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 58, status: 'Inactive',
    activeSemester: false,
    description: 'OOP principles using Java — classes, inheritance, polymorphism.',
    syllabusTopics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Interfaces', 'Exception Handling'],
    gradedComponents: [], resultsPublished: false,
  },

  // ── Semester 3 ──
  {
    code: 'CSC301', name: 'Operating Systems', credits: 4, semester: 3, semesterType: 'Monsoon', year: 2025,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 55, status: 'Inactive',
    activeSemester: false,
    description: 'Process management, memory, file systems, and I/O.',
    syllabusTopics: ['Process Scheduling', 'Memory Management', 'File Systems', 'Deadlocks', 'Virtual Memory'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CSC302', name: 'Design & Analysis of Algorithms', credits: 4, semester: 3, semesterType: 'Monsoon', year: 2025,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 55, status: 'Inactive',
    activeSemester: false,
    description: 'Algorithm design paradigms: greedy, divide & conquer, dynamic programming.',
    syllabusTopics: ['Greedy Algorithms', 'Divide & Conquer', 'Dynamic Programming', 'NP-Completeness'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CSC303', name: 'Computer Networks', credits: 3, semester: 3, semesterType: 'Monsoon', year: 2025,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 55, status: 'Inactive',
    activeSemester: false,
    description: 'OSI model, TCP/IP, routing, switching and application protocols.',
    syllabusTopics: ['OSI Model', 'TCP/IP', 'Routing', 'DNS & HTTP', 'Network Security'],
    gradedComponents: [], resultsPublished: false,
  },

  // ── Semester 4 (current active semester) ──
  {
    code: 'CSC401', name: 'Database Management Systems', credits: 4, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 52, status: 'Active',
    activeSemester: true,
    description: 'Relational model, SQL, normalization, transactions, and indexing.',
    syllabusTopics: ['Relational Model', 'SQL Queries', 'ER Diagrams', 'Normalization', 'Transactions', 'Indexing'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CSC402', name: 'Software Engineering', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 52, status: 'Active',
    activeSemester: true,
    description: 'SDLC, agile methodologies, testing, and project management.',
    syllabusTopics: ['SDLC Models', 'Agile & Scrum', 'Requirements Engineering', 'Testing', 'Project Management'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CSC403', name: 'Artificial Intelligence', credits: 4, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Compulsory', category: 'core', department: 'Computer Science', departmentCode: 'CSC', enrolled: 52, status: 'Active',
    activeSemester: true,
    description: 'Search algorithms, knowledge representation, machine learning intro.',
    syllabusTopics: ['Search Algorithms', 'CSP', 'Bayesian Networks', 'ML Basics', 'Neural Networks Intro'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CSC404', name: 'Web Development', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Elective', category: 'majorElective', department: 'Computer Science', departmentCode: 'CSC', enrolled: 30, status: 'Active',
    activeSemester: true,
    description: 'HTML, CSS, JavaScript, React, and RESTful API design.',
    syllabusTopics: ['HTML/CSS Fundamentals', 'JavaScript ES6+', 'React Basics', 'REST APIs', 'Deployment'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CSC405', name: 'Cloud Computing', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Elective', category: 'majorElective', department: 'Computer Science', departmentCode: 'CSC', enrolled: 22, status: 'Active',
    activeSemester: true,
    description: 'Cloud service models, virtualization, AWS/GCP fundamentals.',
    syllabusTopics: ['Cloud Models (IaaS/PaaS/SaaS)', 'Virtualization', 'AWS Basics', 'Containers & Docker', 'Serverless'],
    gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'CSC406', name: 'Cyber Security', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Elective', category: 'majorElective', department: 'Computer Science', departmentCode: 'CSC', enrolled: 18, status: 'Active',
    activeSemester: true,
    description: 'Cryptography, network security, ethical hacking fundamentals.',
    syllabusTopics: ['Cryptography', 'Firewalls & IDS', 'Web Security', 'Ethical Hacking', 'Digital Forensics'],
    gradedComponents: [], resultsPublished: false,
  },

  // ── UWE Courses (8 total) ──
  {
    code: 'PSY101', name: 'Introduction to Psychology', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Elective', category: 'uwe', department: 'Psychology', departmentCode: 'PSY', enrolled: 25, status: 'Active',
    activeSemester: true, description: 'Fundamentals of human psychology and cognition.',
    syllabusTopics: ['Cognition', 'Behavior', 'Neuroscience'], gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'ENV101', name: 'Environmental Science', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Elective', category: 'uwe', department: 'Environmental Studies', departmentCode: 'ENV', enrolled: 40, status: 'Active',
    activeSemester: true, description: 'Ecology and environmental preservation.',
    syllabusTopics: ['Ecosystems', 'Climate Change'], gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'ECO101', name: 'Principles of Economics', credits: 4, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Elective', category: 'uwe', department: 'Economics', departmentCode: 'ECO', enrolled: 30, status: 'Active',
    activeSemester: true, description: 'Macro and micro economic principles.',
    syllabusTopics: ['Supply & Demand', 'Markets'], gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'HIS101', name: 'World History & Civilizations', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Elective', category: 'uwe', department: 'History', departmentCode: 'HIS', enrolled: 20, status: 'Active',
    activeSemester: true, description: 'Historical study of ancient and modern civilizations.',
    syllabusTopics: ['Ancient Ages', 'Modern Era'], gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'LAW101', name: 'Fundamentals of Law', credits: 4, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Elective', category: 'uwe', department: 'Law', departmentCode: 'LAW', enrolled: 35, status: 'Active',
    activeSemester: true, description: 'Basic legal frameworks and principles.',
    syllabusTopics: ['Constitutional Law', 'Contracts'], gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'ECO102', name: 'Introduction to Microeconomics', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Elective', category: 'uwe', department: 'Economics', departmentCode: 'ECO', enrolled: 22, status: 'Active',
    activeSemester: true, description: 'Microeconomic models and consumer behavior.',
    syllabusTopics: ['Utility', 'Production'], gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'PHY101', name: 'Quantum Physics Fundamentals', credits: 4, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Elective', category: 'uwe', department: 'Physics', departmentCode: 'PHY', enrolled: 15, status: 'Active',
    activeSemester: true, description: 'Introduction to quantum mechanics and wave-particle duality.',
    syllabusTopics: ['Schrödinger Equation', 'Quantum States'], gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'SOC101', name: 'Sociology & Society', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Elective', category: 'uwe', department: 'Sociology', departmentCode: 'SOC', enrolled: 28, status: 'Active',
    activeSemester: true, description: 'Study of social behavior and organization.',
    syllabusTopics: ['Social Networks', 'Culture'], gradedComponents: [], resultsPublished: false,
  },

  // ── CCC Courses (5 total) ──
  {
    code: 'SOC102', name: 'Communication Skills', credits: 1.5, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Elective', category: 'ccc', department: 'Sociology', departmentCode: 'SOC', enrolled: 100, status: 'Active',
    activeSemester: true, description: 'Effective professional communication.',
    syllabusTopics: ['Written Comm', 'Presentations'], gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'SOC103', name: 'Professional Ethics', credits: 1.5, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Elective', category: 'ccc', department: 'Sociology', departmentCode: 'SOC', enrolled: 100, status: 'Active',
    activeSemester: true, description: 'Workplace ethics and professional conduct.',
    syllabusTopics: ['Morality', 'Corporate Ethics'], gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'LAW102', name: 'Indian Constitution & Governance', credits: 3, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Elective', category: 'ccc', department: 'Law', departmentCode: 'LAW', enrolled: 100, status: 'Active',
    activeSemester: true, description: 'Study of the Indian Constitution.',
    syllabusTopics: ['Fundamental Rights', 'Directive Principles'], gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'ENV102', name: 'Environmental Studies', credits: 1.5, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-002', facultyName: 'Prof. Ankit Sharma',
    type: 'Elective', category: 'ccc', department: 'Environmental Studies', departmentCode: 'ENV', enrolled: 100, status: 'Active',
    activeSemester: true, description: 'Basic environmental awareness.',
    syllabusTopics: ['Pollution', 'Conservation'], gradedComponents: [], resultsPublished: false,
  },
  {
    code: 'SOC104', name: 'Yoga & Wellness', credits: 1.5, semester: 4, semesterType: 'Spring', year: 2026,
    facultyId: 'FAC-001', facultyName: 'Dr. Pooja Singh',
    type: 'Elective', category: 'ccc', department: 'Sociology', departmentCode: 'SOC', enrolled: 100, status: 'Active',
    activeSemester: true, description: 'Physical and mental well-being practices.',
    syllabusTopics: ['Asanas', 'Meditation'], gradedComponents: [], resultsPublished: false,
  }
];

export function getGrade(totalPercent) {
  if (totalPercent >= 90) return { letter: 'A+', points: 10 };
  if (totalPercent >= 80) return { letter: 'A',  points: 9 };
  if (totalPercent >= 70) return { letter: 'B+', points: 8 };
  if (totalPercent >= 60) return { letter: 'B',  points: 7 };
  if (totalPercent >= 50) return { letter: 'C',  points: 6 };
  if (totalPercent >= 40) return { letter: 'D',  points: 5 };
  return { letter: 'F', points: 0 };
}

export function getCoursesBySemester(semester) {
  return COURSES.filter(c => c.semester === semester);
}

export function getCoursesByFaculty(facultyId) {
  return COURSES.filter(c => c.facultyId === facultyId);
}

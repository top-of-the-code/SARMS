// Student profiles with full personal info and academic records
// Marks stored per semester: { courseCode, subjectName, credits, grade, gradePoints }
// Current semester (4) marks are in the marksManagement.js for faculty editing

export const STUDENTS = [
  {
    rollNo: 'CS-2022-001',
    name: 'Aarav Sharma',
    fatherName: 'Ramesh Sharma',
    motherName: 'Sunita Sharma',
    guardianPhone: '+91 98765 12300',
    personalPhone: '+91 99887 76655',
    address: '12, Green Valley Apartments, Sector 45, Noida, UP - 201301',
    dob: '2004-03-14',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'aarav.sharma@cs.compscience.edu',
    bloodGroup: 'O+',
    academicRecord: [
      {
        semester: 1, sgpa: 9.1,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'A+', gradePoints: 10 },
        ],
      },
      {
        semester: 2, sgpa: 8.6,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'A+', gradePoints: 10 },
        ],
      },
      {
        semester: 3, sgpa: 8.9,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'A',  gradePoints: 9  },
        ],
      },
    ],
  },
  {
    rollNo: 'CS-2022-002',
    name: 'Priya Nair',
    fatherName: 'Suresh Nair',
    motherName: 'Latha Nair',
    guardianPhone: '+91 97654 32100',
    personalPhone: '+91 99001 12233',
    address: '7, Lotus Lane, Koramangala, Bengaluru, KA - 560034',
    dob: '2004-07-22',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'priya.nair@cs.compscience.edu',
    bloodGroup: 'B+',
    academicRecord: [
      {
        semester: 1, sgpa: 9.5,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'A',  gradePoints: 9  },
        ],
      },
      {
        semester: 2, sgpa: 9.2,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'A+', gradePoints: 10 },
        ],
      },
      {
        semester: 3, sgpa: 9.0,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'A',  gradePoints: 9  },
        ],
      },
    ],
  },
  {
    rollNo: 'CS-2022-003',
    name: 'Rohan Mehta',
    fatherName: 'Vijay Mehta',
    motherName: 'Kavita Mehta',
    guardianPhone: '+91 91234 56789',
    personalPhone: '+91 98111 22333',
    address: '34, Shivaji Park, Dadar, Mumbai, MH - 400028',
    dob: '2003-11-05',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'rohan.mehta@cs.compscience.edu',
    bloodGroup: 'A+',
    academicRecord: [
      {
        semester: 1, sgpa: 7.8,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'B',  gradePoints: 7 },
        ],
      },
      {
        semester: 2, sgpa: 8.0,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'B+', gradePoints: 8 },
        ],
      },
      {
        semester: 3, sgpa: 8.2,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'B+', gradePoints: 8 },
        ],
      },
    ],
  },
  {
    rollNo: 'CS-2022-004',
    name: 'Sneha Patel',
    fatherName: 'Hasmukh Patel',
    motherName: 'Hina Patel',
    guardianPhone: '+91 93456 78901',
    personalPhone: '+91 97654 11223',
    address: '22, Navrangpura, Ahmedabad, GJ - 380009',
    dob: '2004-01-18',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'sneha.patel@cs.compscience.edu',
    bloodGroup: 'AB+',
    academicRecord: [
      {
        semester: 1, sgpa: 8.8,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'A',  gradePoints: 9  },
        ],
      },
      {
        semester: 2, sgpa: 8.5,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'B+', gradePoints: 8 },
        ],
      },
      {
        semester: 3, sgpa: 8.7,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'B+', gradePoints: 8  },
        ],
      },
    ],
  },
  {
    rollNo: 'CS-2022-005',
    name: 'Kiran Verma',
    fatherName: 'Sunil Verma',
    motherName: 'Rekha Verma',
    guardianPhone: '+91 98888 55444',
    personalPhone: '+91 90000 11234',
    address: '5, Civil Lines, Allahabad, UP - 211001',
    dob: '2003-09-30',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'kiran.verma@cs.compscience.edu',
    bloodGroup: 'O-',
    academicRecord: [
      {
        semester: 1, sgpa: 7.2,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'B',  gradePoints: 7 },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'B',  gradePoints: 7 },
        ],
      },
      {
        semester: 2, sgpa: 7.5,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'B',  gradePoints: 7 },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'B',  gradePoints: 7 },
        ],
      },
      {
        semester: 3, sgpa: 7.8,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'B',  gradePoints: 7 },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'B+', gradePoints: 8 },
        ],
      },
    ],
  },
  {
    rollNo: 'CS-2022-006',
    name: 'Anjali Singh',
    fatherName: 'Rakesh Singh',
    motherName: 'Meena Singh',
    guardianPhone: '+91 94444 33221',
    personalPhone: '+91 91111 00009',
    address: '10, Rajendra Nagar, Patna, BR - 800016',
    dob: '2004-05-12',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'anjali.singh@cs.compscience.edu',
    bloodGroup: 'B-',
    academicRecord: [
      {
        semester: 1, sgpa: 8.3,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'B+', gradePoints: 8 },
        ],
      },
      {
        semester: 2, sgpa: 8.0,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'B+', gradePoints: 8 },
        ],
      },
      {
        semester: 3, sgpa: 8.4,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'B+', gradePoints: 8  },
        ],
      },
    ],
  },
  {
    rollNo: 'CS-2022-007',
    name: 'Dev Kapoor',
    fatherName: 'Anil Kapoor',
    motherName: 'Sonia Kapoor',
    guardianPhone: '+91 96666 77889',
    personalPhone: '+91 98765 43210',
    address: '3, Model Town, Ludhiana, PB - 141002',
    dob: '2003-12-25',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'dev.kapoor@cs.compscience.edu',
    bloodGroup: 'A-',
    academicRecord: [
      {
        semester: 1, sgpa: 6.8,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'C',  gradePoints: 6 },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'B',  gradePoints: 7 },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'B',  gradePoints: 7 },
        ],
      },
      {
        semester: 2, sgpa: 7.1,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'B',  gradePoints: 7 },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'C',  gradePoints: 6 },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'B+', gradePoints: 8 },
        ],
      },
      {
        semester: 3, sgpa: 7.3,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'B',  gradePoints: 7 },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'B',  gradePoints: 7 },
        ],
      },
    ],
  },
  {
    rollNo: 'CS-2022-008',
    name: 'Meera Joshi',
    fatherName: 'Prakash Joshi',
    motherName: 'Usha Joshi',
    guardianPhone: '+91 92222 33445',
    personalPhone: '+91 87654 32100',
    address: '8, Shastri Nagar, Jaipur, RJ - 302016',
    dob: '2004-02-28',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'meera.joshi@cs.compscience.edu',
    bloodGroup: 'O+',
    academicRecord: [
      {
        semester: 1, sgpa: 9.3,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'A',  gradePoints: 9  },
        ],
      },
      {
        semester: 2, sgpa: 9.1,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'A',  gradePoints: 9  },
        ],
      },
      {
        semester: 3, sgpa: 8.8,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'A',  gradePoints: 9  },
        ],
      },
    ],
  },
  {
    rollNo: 'CS-2022-009',
    name: 'Arjun Rao',
    fatherName: 'Srinivas Rao',
    motherName: 'Lakshmi Rao',
    guardianPhone: '+91 95555 66778',
    personalPhone: '+91 99123 45678',
    address: '15, Himayatnagar, Hyderabad, TS - 500029',
    dob: '2003-08-10',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'arjun.rao@cs.compscience.edu',
    bloodGroup: 'AB-',
    academicRecord: [
      {
        semester: 1, sgpa: 7.5,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'B',  gradePoints: 7 },
        ],
      },
      {
        semester: 2, sgpa: 7.9,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'B',  gradePoints: 7 },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'B+', gradePoints: 8 },
        ],
      },
      {
        semester: 3, sgpa: 8.1,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'B+', gradePoints: 8 },
        ],
      },
    ],
  },
  {
    rollNo: 'CS-2022-010',
    name: 'Ishaan Gupta',
    fatherName: 'Rajiv Gupta',
    motherName: 'Preet Gupta',
    guardianPhone: '+91 99999 00001',
    personalPhone: '+91 91234 01234',
    address: '19, Pitampura, New Delhi - 110088',
    dob: '2004-06-15',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'ishaan.gupta@cs.compscience.edu',
    bloodGroup: 'B+',
    academicRecord: [
      {
        semester: 1, sgpa: 8.1,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'A',  gradePoints: 9 },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'A',  gradePoints: 9 },
        ],
      },
      {
        semester: 2, sgpa: 8.3,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'B+', gradePoints: 8  },
        ],
      },
      {
        semester: 3, sgpa: 8.5,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'A+', gradePoints: 10 },
        ],
      },
    ],
  },
  {
    rollNo: 'CS-2022-011',
    name: 'Tanvi Desai',
    fatherName: 'Nikhil Desai',
    motherName: 'Nisha Desai',
    guardianPhone: '+91 93333 22110',
    personalPhone: '+91 95678 90123',
    address: '6, Navpada, Ghatkopar, Mumbai, MH - 400077',
    dob: '2004-10-03',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'tanvi.desai@cs.compscience.edu',
    bloodGroup: 'A+',
    academicRecord: [
      {
        semester: 1, sgpa: 8.9,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'A',  gradePoints: 9  },
        ],
      },
      {
        semester: 2, sgpa: 8.6,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'B+', gradePoints: 8  },
        ],
      },
      {
        semester: 3, sgpa: 9.0,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'A',  gradePoints: 9  },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A+', gradePoints: 10 },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'A',  gradePoints: 9  },
        ],
      },
    ],
  },
  {
    rollNo: 'CS-2022-012',
    name: 'Rahul Bose',
    fatherName: 'Debasish Bose',
    motherName: 'Rupa Bose',
    guardianPhone: '+91 97777 44335',
    personalPhone: '+91 86543 21000',
    address: '21, Ballygunge Place, Kolkata, WB - 700019',
    dob: '2003-04-07',
    program: 'B.Tech Computer Science',
    batchYear: 2022,
    email: 'rahul.bose@cs.compscience.edu',
    bloodGroup: 'O+',
    academicRecord: [
      {
        semester: 1, sgpa: 7.0,
        courses: [
          { code: 'CS101', name: 'Mathematics I',           credits: 4, grade: 'B',  gradePoints: 7 },
          { code: 'CS102', name: 'Programming Fundamentals', credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS103', name: 'Digital Logic Design',    credits: 3, grade: 'C',  gradePoints: 6 },
        ],
      },
      {
        semester: 2, sgpa: 7.3,
        courses: [
          { code: 'CS201', name: 'Data Structures',             credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS202', name: 'Mathematics II',              credits: 4, grade: 'C',  gradePoints: 6 },
          { code: 'CS203', name: 'Object-Oriented Programming', credits: 3, grade: 'B',  gradePoints: 7 },
        ],
      },
      {
        semester: 3, sgpa: 7.6,
        courses: [
          { code: 'CS301', name: 'Operating Systems',               credits: 4, grade: 'B+', gradePoints: 8 },
          { code: 'CS302', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'B',  gradePoints: 7 },
          { code: 'CS303', name: 'Computer Networks',               credits: 3, grade: 'B+', gradePoints: 8 },
        ],
      },
    ],
  },
];

/**
 * Calculate CGPA from all completed academic records
 * @param {Array} academicRecord - array of semester records
 * @returns {number} CGPA rounded to 2 decimal places
 */
export function calculateCGPA(academicRecord) {
  let totalCredits = 0;
  let totalWeighted = 0;
  academicRecord.forEach(sem => {
    sem.courses.forEach(c => {
      totalCredits += c.credits;
      totalWeighted += c.credits * c.gradePoints;
    });
  });
  return totalCredits > 0 ? Math.round((totalWeighted / totalCredits) * 100) / 100 : 0;
}

/**
 * Find a student by their roll number
 */
export function getStudentByRoll(rollNo) {
  return STUDENTS.find(s => s.rollNo === rollNo) || null;
}

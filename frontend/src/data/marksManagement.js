// Marks management data for faculty
// Each course has:
//   - gradingComponents: array of { id, name, weight (%) }, faculty-defined, must sum to 100
//   - studentMarks: array per student with marks per component
// Only activeSemester:true courses are editable

export const MARKS_DATA = {
  // CSC401, taught by FAC-001 (Dr. Pooja Singh), ACTIVE
  'CSC401': {
    courseCode: 'CSC401',
    courseName: 'Database Management Systems',
    semester: 4,
    activeSemester: true,
    gradingComponents: [
      { id: 'comp1', name: 'Assignments',   weight: 20 },
      { id: 'comp2', name: 'Quiz',          weight: 10 },
      { id: 'comp3', name: 'Mid-Semester',  weight: 30 },
      { id: 'comp4', name: 'End-Semester',  weight: 40 },
    ],
    studentMarks: [
      { rollNo: 'CS-2022-001', name: 'Aarav Sharma',  marks: { comp1: 18, comp2: 9,  comp3: 27, comp4: 36 } },
      { rollNo: 'CS-2022-002', name: 'Priya Nair',    marks: { comp1: 19, comp2: 10, comp3: 28, comp4: 38 } },
      { rollNo: 'CS-2022-003', name: 'Rohan Mehta',   marks: { comp1: 15, comp2: 7,  comp3: 22, comp4: 30 } },
      { rollNo: 'CS-2022-004', name: 'Sneha Patel',   marks: { comp1: 17, comp2: 9,  comp3: 26, comp4: 35 } },
      { rollNo: 'CS-2022-005', name: 'Kiran Verma',   marks: { comp1: 14, comp2: 6,  comp3: 20, comp4: 28 } },
      { rollNo: 'CS-2022-006', name: 'Anjali Singh',  marks: { comp1: 16, comp2: 8,  comp3: 25, comp4: 33 } },
      { rollNo: 'CS-2022-007', name: 'Dev Kapoor',    marks: { comp1: 12, comp2: 5,  comp3: 18, comp4: 25 } },
      { rollNo: 'CS-2022-008', name: 'Meera Joshi',   marks: { comp1: 19, comp2: 9,  comp3: 28, comp4: 37 } },
      { rollNo: 'CS-2022-009', name: 'Arjun Rao',     marks: { comp1: 15, comp2: 7,  comp3: 23, comp4: 31 } },
      { rollNo: 'CS-2022-010', name: 'Ishaan Gupta',  marks: { comp1: 16, comp2: 8,  comp3: 24, comp4: 34 } },
      { rollNo: 'CS-2022-011', name: 'Tanvi Desai',   marks: { comp1: 18, comp2: 8,  comp3: 26, comp4: 36 } },
      { rollNo: 'CS-2022-012', name: 'Rahul Bose',    marks: { comp1: 13, comp2: 6,  comp3: 19, comp4: 27 } },
    ],
  },

  // CSC404, taught by FAC-001 (Dr. Pooja Singh), ACTIVE
  'CSC404': {
    courseCode: 'CSC404',
    courseName: 'Web Development',
    semester: 4,
    activeSemester: true,
    gradingComponents: [
      { id: 'comp1', name: 'Mini Project',   weight: 25 },
      { id: 'comp2', name: 'Quiz',           weight: 15 },
      { id: 'comp3', name: 'Mid-Semester',   weight: 25 },
      { id: 'comp4', name: 'Final Project',  weight: 35 },
    ],
    studentMarks: [
      { rollNo: 'CS-2022-001', name: 'Aarav Sharma',  marks: { comp1: 22, comp2: 13, comp3: 22, comp4: 32 } },
      { rollNo: 'CS-2022-002', name: 'Priya Nair',    marks: { comp1: 24, comp2: 14, comp3: 24, comp4: 34 } },
      { rollNo: 'CS-2022-003', name: 'Rohan Mehta',   marks: { comp1: 18, comp2: 10, comp3: 18, comp4: 27 } },
      { rollNo: 'CS-2022-004', name: 'Sneha Patel',   marks: { comp1: 21, comp2: 12, comp3: 21, comp4: 30 } },
      { rollNo: 'CS-2022-005', name: 'Kiran Verma',   marks: { comp1: 16, comp2: 9,  comp3: 17, comp4: 24 } },
      { rollNo: 'CS-2022-006', name: 'Anjali Singh',  marks: { comp1: 20, comp2: 11, comp3: 20, comp4: 29 } },
    ],
  },

  // CSC402, taught by FAC-002 (Prof. Ankit Sharma), ACTIVE
  'CSC402': {
    courseCode: 'CSC402',
    courseName: 'Software Engineering',
    semester: 4,
    activeSemester: true,
    gradingComponents: [
      { id: 'comp1', name: 'Assignment 1',   weight: 15 },
      { id: 'comp2', name: 'Assignment 2',   weight: 15 },
      { id: 'comp3', name: 'Mid-Semester',   weight: 30 },
      { id: 'comp4', name: 'End-Semester',   weight: 40 },
    ],
    studentMarks: [
      { rollNo: 'CS-2022-001', name: 'Aarav Sharma',  marks: { comp1: 13, comp2: 13, comp3: 26, comp4: 36 } },
      { rollNo: 'CS-2022-002', name: 'Priya Nair',    marks: { comp1: 14, comp2: 14, comp3: 28, comp4: 38 } },
      { rollNo: 'CS-2022-003', name: 'Rohan Mehta',   marks: { comp1: 11, comp2: 11, comp3: 22, comp4: 31 } },
      { rollNo: 'CS-2022-004', name: 'Sneha Patel',   marks: { comp1: 12, comp2: 12, comp3: 25, comp4: 35 } },
      { rollNo: 'CS-2022-005', name: 'Kiran Verma',   marks: { comp1: 10, comp2: 10, comp3: 19, comp4: 27 } },
      { rollNo: 'CS-2022-006', name: 'Anjali Singh',  marks: { comp1: 12, comp2: 12, comp3: 24, comp4: 33 } },
      { rollNo: 'CS-2022-007', name: 'Dev Kapoor',    marks: { comp1: 9,  comp2: 9,  comp3: 17, comp4: 24 } },
      { rollNo: 'CS-2022-008', name: 'Meera Joshi',   marks: { comp1: 14, comp2: 14, comp3: 27, comp4: 37 } },
      { rollNo: 'CS-2022-009', name: 'Arjun Rao',     marks: { comp1: 11, comp2: 11, comp3: 22, comp4: 30 } },
      { rollNo: 'CS-2022-010', name: 'Ishaan Gupta',  marks: { comp1: 12, comp2: 12, comp3: 24, comp4: 34 } },
      { rollNo: 'CS-2022-011', name: 'Tanvi Desai',   marks: { comp1: 13, comp2: 13, comp3: 26, comp4: 35 } },
      { rollNo: 'CS-2022-012', name: 'Rahul Bose',    marks: { comp1: 10, comp2: 10, comp3: 19, comp4: 26 } },
    ],
  },

  // CSC403, taught by FAC-002, ACTIVE
  'CSC403': {
    courseCode: 'CSC403',
    courseName: 'Artificial Intelligence',
    semester: 4,
    activeSemester: true,
    gradingComponents: [
      { id: 'comp1', name: 'Lab Work',      weight: 20 },
      { id: 'comp2', name: 'Quiz',          weight: 10 },
      { id: 'comp3', name: 'Mid-Semester',  weight: 30 },
      { id: 'comp4', name: 'End-Semester',  weight: 40 },
    ],
    studentMarks: [
      { rollNo: 'CS-2022-001', name: 'Aarav Sharma',  marks: { comp1: 17, comp2: 9,  comp3: 27, comp4: 37 } },
      { rollNo: 'CS-2022-002', name: 'Priya Nair',    marks: { comp1: 19, comp2: 10, comp3: 28, comp4: 39 } },
      { rollNo: 'CS-2022-003', name: 'Rohan Mehta',   marks: { comp1: 14, comp2: 7,  comp3: 22, comp4: 31 } },
      { rollNo: 'CS-2022-004', name: 'Sneha Patel',   marks: { comp1: 16, comp2: 8,  comp3: 26, comp4: 36 } },
      { rollNo: 'CS-2022-005', name: 'Kiran Verma',   marks: { comp1: 13, comp2: 6,  comp3: 20, comp4: 28 } },
      { rollNo: 'CS-2022-006', name: 'Anjali Singh',  marks: { comp1: 15, comp2: 8,  comp3: 24, comp4: 33 } },
      { rollNo: 'CS-2022-007', name: 'Dev Kapoor',    marks: { comp1: 12, comp2: 5,  comp3: 17, comp4: 24 } },
      { rollNo: 'CS-2022-008', name: 'Meera Joshi',   marks: { comp1: 18, comp2: 9,  comp3: 27, comp4: 37 } },
      { rollNo: 'CS-2022-009', name: 'Arjun Rao',     marks: { comp1: 14, comp2: 7,  comp3: 23, comp4: 32 } },
      { rollNo: 'CS-2022-010', name: 'Ishaan Gupta',  marks: { comp1: 15, comp2: 8,  comp3: 24, comp4: 35 } },
      { rollNo: 'CS-2022-011', name: 'Tanvi Desai',   marks: { comp1: 17, comp2: 8,  comp3: 26, comp4: 36 } },
      { rollNo: 'CS-2022-012', name: 'Rahul Bose',    marks: { comp1: 12, comp2: 6,  comp3: 19, comp4: 27 } },
    ],
  },

  // Past semesters, read-only (activeSemester: false)
  'CSC301': {
    courseCode: 'CSC301',
    courseName: 'Operating Systems',
    semester: 3,
    activeSemester: false,
    gradingComponents: [
      { id: 'comp1', name: 'Assignments',   weight: 20 },
      { id: 'comp2', name: 'Mid-Semester',  weight: 30 },
      { id: 'comp3', name: 'End-Semester',  weight: 50 },
    ],
    studentMarks: [
      { rollNo: 'CS-2022-001', name: 'Aarav Sharma',  marks: { comp1: 18, comp2: 27, comp3: 45 } },
      { rollNo: 'CS-2022-002', name: 'Priya Nair',    marks: { comp1: 18, comp2: 27, comp3: 45 } },
      { rollNo: 'CS-2022-003', name: 'Rohan Mehta',   marks: { comp1: 16, comp2: 24, comp3: 40 } },
      { rollNo: 'CS-2022-004', name: 'Sneha Patel',   marks: { comp1: 17, comp2: 26, comp3: 43 } },
    ],
  },
};

/**
 * Calculate weighted total percentage from marks and components
 * @param {Object} marks - { compId: rawScore }
 * @param {Array} components - [{ id, name, weight }]
 * @returns {number} total percentage 0–100
 */
export function calcWeightedTotal(marks, components) {
  let total = 0;
  components.forEach(comp => {
    // Check if component name implies Best N of M
    const match = comp.name?.match(/Best (\d+) of (\d+)/);
    if (match) {
      const N = parseInt(match[1], 10);
      const M = parseInt(match[2], 10);
      
      const compScores = [];
      for (let i = 0; i < M; i++) {
        const val = marks[`${comp.id}_${i}`];
        if (typeof val === 'number') {
          compScores.push(val);
        }
      }
      // Sort descending and take Best N
      compScores.sort((a, b) => b - a);
      const bestN = compScores.slice(0, N);
      const scored = bestN.reduce((sum, s) => sum + s, 0);
      
      // Ensure the Best N score does not exceed the allowed max weight per component theoretically, 
      // though typically the faculty enters numbers whose best N sum up to the weight.
      total += Math.min(scored, comp.weight);
    } else {
      // Standard grading component
      const scored = marks[comp.id] ?? 0;
      total += Math.min(scored, comp.weight);
    }
  });
  return Math.round(total * 10) / 10;
}

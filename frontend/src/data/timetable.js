// Timetable data for the current student (Semester 4 schedule)
// days: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat
// startHour / endHour in 24h format
// color: Tailwind bg class for color-coding by subject

export const TIMETABLE_SLOTS = [
  // ── CSC401: Database Management Systems ──
  {
    id: 1, courseCode: 'CSC401', courseName: 'Database Management Systems',
    type: 'Lecture', room: 'LH-301', facultyName: 'Dr. Pooja Singh',
    days: [0, 2], startHour: 9, endHour: 10,   // Mon, Wed 9–10 AM
    color: 'bg-blue-100 border-blue-400 text-blue-900',
  },
  {
    id: 2, courseCode: 'CSC401', courseName: 'Database Management Systems',
    type: 'Lab', room: 'DB-Lab', facultyName: 'Dr. Pooja Singh',
    days: [4], startHour: 14, endHour: 16,      // Fri 2–4 PM
    color: 'bg-blue-100 border-blue-400 text-blue-900',
  },

  // ── CSC402: Software Engineering ──
  {
    id: 3, courseCode: 'CSC402', courseName: 'Software Engineering',
    type: 'Lecture', room: 'LH-205', facultyName: 'Prof. Ankit Sharma',
    days: [1, 3], startHour: 10, endHour: 11,  // Tue, Thu 10–11 AM
    color: 'bg-emerald-100 border-emerald-400 text-emerald-900',
  },

  // ── CSC403: Artificial Intelligence ──
  {
    id: 4, courseCode: 'CSC403', courseName: 'Artificial Intelligence',
    type: 'Lecture', room: 'LH-104', facultyName: 'Prof. Ankit Sharma',
    days: [0, 3], startHour: 11, endHour: 12,  // Mon, Thu 11–12 PM
    color: 'bg-purple-100 border-purple-400 text-purple-900',
  },
  {
    id: 5, courseCode: 'CSC403', courseName: 'Artificial Intelligence',
    type: 'Lab', room: 'AI-Lab', facultyName: 'Prof. Ankit Sharma',
    days: [2], startHour: 15, endHour: 17,     // Wed 3–5 PM
    color: 'bg-purple-100 border-purple-400 text-purple-900',
  },

  // ── CSC404: Web Development (Elective) ──
  {
    id: 6, courseCode: 'CSC404', courseName: 'Web Development',
    type: 'Lecture', room: 'LH-202', facultyName: 'Dr. Pooja Singh',
    days: [1, 5], startHour: 13, endHour: 14,  // Tue, Sat 1–2 PM
    color: 'bg-amber-100 border-amber-400 text-amber-900',
  },
  {
    id: 7, courseCode: 'CSC404', courseName: 'Web Development',
    type: 'Lab', room: 'CS-Lab-2', facultyName: 'Dr. Pooja Singh',
    days: [5], startHour: 10, endHour: 12,      // Sat 10-12 AM
    color: 'bg-amber-100 border-amber-400 text-amber-900',
  },

  // ── CSC402 Tutorial ──
  {
    id: 8, courseCode: 'CSC402', courseName: 'Software Engineering',
    type: 'Tutorial', room: 'LH-107', facultyName: 'Prof. Ankit Sharma',
    days: [4], startHour: 9, endHour: 10,      // Fri 9–10 AM
    color: 'bg-emerald-100 border-emerald-400 text-emerald-900',
  },
];

/**
 * Returns all slots for a given day index (0=Mon … 5=Sat)
 */
export function getSlotsForDay(dayIndex) {
  return TIMETABLE_SLOTS.filter(s => s.days.includes(dayIndex));
}

// Time range for the timetable grid
export const TIMETABLE_START_HOUR = 8;
export const TIMETABLE_END_HOUR = 18;

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

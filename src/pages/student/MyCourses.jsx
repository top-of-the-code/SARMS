import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { BookOpen, Award, CheckCircle, Clock } from 'lucide-react';

export default function MyCourses() {
  const { currentUser } = useAuth();
  const [student, setStudent] = useState(null);
  const [coursesMap, setCoursesMap] = useState({});
  const [marksMap, setMarksMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSem, setActiveSem] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get(`/students/${currentUser.id}`),
      api.get('/courses')
    ]).then(([stuRes, courRes]) => {
      setStudent(stuRes.data);
      const cMap = {};
      courRes.data.forEach(c => cMap[c.code] = c);
      setCoursesMap(cMap);

      const activeS = stuRes.data.currentSemester || 1;
      setActiveSem(activeS);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [currentUser.id]);

  useEffect(() => {
    if (!student || !activeSem) return;
    
    const semRecord = (student.academicRecord || []).find(r => r.semester === activeSem);
    if (!semRecord || !semRecord.courses) return;

    const fetchMarks = async () => {
      const mMap = { ...marksMap };
      for (let c of semRecord.courses) {
        if (!mMap[c.courseCode]) {
          try {
             const res = await api.get(`/marks/${c.courseCode}`);
             mMap[c.courseCode] = res.data;
          } catch {
             mMap[c.courseCode] = null;
          }
        }
      }
      setMarksMap(mMap);
    };
    fetchMarks();
  }, [activeSem, student]);

  if (loading || !student) {
    return <div className="p-8 text-center font-bold text-gray-500">Loading your courses...</div>;
  }

  const semesters = [...student.academicRecord]
    .filter(r => r.semester <= 8)
    .sort((a,b) => b.semester - a.semester);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-navy">My Courses</h2>
        <p className="text-sm font-medium text-gray-500 mt-2">View your registered courses and performance breakdown.</p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {semesters.map(sem => (
          <button
            key={sem.semester}
            onClick={() => setActiveSem(sem.semester)}
            className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all whitespace-nowrap shadow-sm border-2 ${
              activeSem === sem.semester 
                ? 'bg-navy text-white border-navy' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-navy hover:text-navy'
            }`}
          >
            Semester {sem.semester}
          </button>
        ))}
      </div>

      <div>
        {semesters.filter(s => s.semester === activeSem).map(sem => (
          <div key={sem.semester} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {sem.courses.length === 0 ? (
                <div className="col-span-full p-8 text-center text-gray-500 font-bold bg-white rounded-2xl border-2 border-gray-100">
                  No courses registered for this semester.
                </div>
             ) : sem.courses.map(course => {
                const fullCourseData = coursesMap[course.courseCode] || {};
                const courseMarksData = marksMap[course.courseCode];
                let studentComponentMarks = null;
                
                if (courseMarksData && courseMarksData.studentMarks) {
                   const sm = courseMarksData.studentMarks.find(m => m.rollNo === student.rollNo);
                   if (sm) studentComponentMarks = sm.marks;
                }

                return (
                  <div key={course.courseCode} className="bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-gold/50 transition-colors p-6">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                         <span className="text-xs font-extrabold text-gold bg-gold/10 px-2 py-1 rounded-md mb-2 inline-block">
                           {course.courseCode}
                         </span>
                         <h3 className="text-lg font-black text-navy leading-tight">{course.courseName}</h3>
                       </div>
                       <div className="text-right shrink-0">
                         {course.grade === 'IP' ? (
                           <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                             <Clock className="w-3.5 h-3.5" /> In Progress
                           </span>
                         ) : (
                           <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                             <CheckCircle className="w-3.5 h-3.5" /> Grade: {course.grade}
                           </span>
                         )}
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-5">
                       <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                         <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Credits</p>
                         <p className="text-sm font-bold text-navy">{course.credits}</p>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                         <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Faculty</p>
                         <p className="text-sm font-bold text-navy truncate">{fullCourseData.facultyName || 'TBA'}</p>
                       </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5">
                      <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-gold" /> Component Breakdown
                      </h4>
                      
                      {(!fullCourseData.gradedComponents || fullCourseData.gradedComponents.length === 0) ? (
                        <p className="text-sm text-gray-400 font-medium italic">No grading components defined yet.</p>
                      ) : (
                        <div className="space-y-0">
                          {fullCourseData.gradedComponents.map((gc, i) => {
                             const match = gc.name?.match(/Best (\d+) of (\d+)/);
                             
                             if (match) {
                               const N = parseInt(match[1], 10);
                               const M = parseInt(match[2], 10);
                               const attempts = [];
                               for(let idx = 0; idx < M; idx++) {
                                 const key = `${gc.id}_${idx}`;
                                 const val = studentComponentMarks?.[key];
                                 attempts.push(val !== undefined && val !== null ? Number(val) : '--');
                               }
                               
                               const validAttempts = attempts.filter(a => typeof a === 'number').sort((a,b) => b-a);
                               const bestN = validAttempts.slice(0, N);
                               const bestNSum = bestN.reduce((a,b) => a+b, 0);
                               const maxPerAttempt = Math.round(gc.weight / N);

                               return (
                                 <div key={i} className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-3 first:border-0 first:pt-0 first:mt-0 text-sm">
                                   <div className="flex justify-between items-center">
                                     <div>
                                       <p className="font-bold text-navy capitalize">{gc.name}</p>
                                       <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Comb. Max: {gc.weight}</p>
                                     </div>
                                     <div className="text-right">
                                       <p className="font-black text-navy">{validAttempts.length > 0 ? bestNSum : '--'} <span className="text-gray-300 font-medium">/ {gc.weight}</span></p>
                                     </div>
                                   </div>
                                   <div className="pl-2 space-y-1.5 mb-1">
                                     {attempts.map((att, idx) => (
                                       <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-md text-xs border border-gray-100">
                                         <span className="text-gray-500 font-medium">Attempt {idx + 1}</span>
                                         <span className="font-bold text-navy">{att} <span className="text-gray-400">/ {maxPerAttempt}</span></span>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               );
                             } else {
                               const score = studentComponentMarks && studentComponentMarks[gc.id] !== undefined ? studentComponentMarks[gc.id] : '--';
                               return (
                                 <div key={i} className="flex justify-between items-center text-sm pt-3 border-t border-gray-100 mt-3 first:border-0 first:pt-0 first:mt-0">
                                   <div>
                                     <p className="font-bold text-navy capitalize">{gc.type || gc.name}</p>
                                     <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Max Marks: {gc.weight}</p>
                                   </div>
                                   <div className="text-right">
                                     <p className="font-black text-navy">{score} <span className="text-gray-300 font-medium">/ {gc.weight}</span></p>
                                   </div>
                                 </div>
                               );
                             }
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
             })}
          </div>
        ))}
      </div>
    </div>
  );
}

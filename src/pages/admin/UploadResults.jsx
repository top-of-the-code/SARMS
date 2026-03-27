import { useState, useMemo } from 'react';
import { COURSES } from '../../data/courses';
import { STUDENTS } from '../../data/students';
import Modal from '../../components/Modal';
import { useShowToast } from '../../components/Layout';
import { BookOpen, Upload, Search, CheckCircle, AlertTriangle } from 'lucide-react';

export default function UploadResults() {
  const showToast = useShowToast();
  
  // Create a local snapshot of courses to allow mutation
  const [localCourses, setLocalCourses] = useState(COURSES.map(c => ({ ...c })));
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [search, setSearch] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Extract relevant courses
  const uniqueCourseIds = [...new Set(STUDENTS.flatMap(s => s.academicRecord.flatMap(r => r.courses.map(c => c.code))))];
  
  const courseOptions = localCourses.filter(c => uniqueCourseIds.includes(c.code));
  
  const currentCourse = courseOptions.find(c => c.code === selectedCourse);

  const studentsInCourse = useMemo(() => {
    if (!currentCourse) return [];
    
    let list = [];
    STUDENTS.forEach(student => {
      (student.academicRecord || []).forEach(record => {
        const found = record.courses.find(c => c.code === currentCourse.code);
        if (found) {
          list.push({
            rollNo: student.rollNo,
            name: student.name,
            grade: found.grade || 'N/A',
            // Mock final marks logic based on grade
            marks: getMockMarks(found.grade, found.code)
          });
        }
      });
    });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.rollNo.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }

    return list;
  }, [currentCourse, search]);

  function getMockMarks(grade, code) {
    const map = { 'A+': 95, 'A': 85, 'B+': 76, 'B': 68, 'C': 55, 'D': 45, 'F': 35 };
    const base = map[grade] || '--';
    if (base === '--') return base;
    const modifier = code.charCodeAt(code.length - 1) % 5; 
    return base + modifier;
  }

  function handlePublish() {
    setLocalCourses(prev => prev.map(c => c.code === selectedCourse ? { ...c, resultsPublished: true } : c));
    setShowConfirm(false);
    showToast('Results published successfully. Students can now view their grades.', 'success');
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-extrabold text-navy">Upload Results</h2>
        <p className="text-sm font-medium text-gray-500 mt-2">Publish finalized end-of-semester grades for students.</p>
      </div>

      {/* Select Course Section */}
      <section className="bg-white rounded-2xl shadow-card border border-gray-200 p-6 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Select Course to Publish Results
            </label>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 font-bold text-navy transition-all bg-white"
            >
              <option value="">-- Choose a Course --</option>
              {courseOptions.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.semesterType} {c.year}) {c.resultsPublished ? '✓ Published' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentCourse && (
           <div className="mt-4 flex gap-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
             <div>
               <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Semester Details</p>
               <p className="text-sm font-extrabold text-navy">{currentCourse.semesterType} {currentCourse.year}</p>
             </div>
             <div>
               <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Enrolled Students</p>
               <p className="text-sm font-extrabold text-navy">{studentsInCourse.length}</p>
             </div>
             <div>
               <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Status</p>
               {currentCourse.resultsPublished ? (
                  <span className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                     <CheckCircle className="w-4 h-4" /> Published
                  </span>
               ) : (
                  <span className="flex items-center gap-1.5 text-sm font-extrabold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-md">
                     <AlertTriangle className="w-4 h-4" /> Pending
                  </span>
               )}
             </div>
           </div>
        )}
      </section>

      {/* Results Table */}
      {currentCourse && studentsInCourse.length > 0 && (
        <section className="bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold" /> Student Results
            </h3>
            
            <div className="relative min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Find student..."
                className="w-full pl-9 pr-4 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-medium" />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-sm whitespace-nowrap text-left border-collapse">
              <thead className="bg-navy/5 border-b border-gray-200 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-navy uppercase tracking-wider">Roll No</th>
                  <th className="px-6 py-4 text-xs font-bold text-navy uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-navy uppercase tracking-wider text-center">Final Marks</th>
                  <th className="px-6 py-4 text-xs font-bold text-navy uppercase tracking-wider text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {studentsInCourse.map((s, i) => (
                  <tr key={s.rollNo} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gold/5 transition-colors border-b border-gray-100 last:border-0`}>
                    <td className="px-6 py-3 font-bold text-gold">{s.rollNo}</td>
                    <td className="px-6 py-3 font-semibold text-gray-800">{s.name}</td>
                    <td className="px-6 py-3 text-center font-bold text-gray-600">{s.marks}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold shadow-sm ${s.grade.includes('F') ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {s.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => setShowConfirm(true)}
              disabled={currentCourse.resultsPublished}
              className="flex items-center gap-2 px-6 py-3 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md focus:ring-4 focus:ring-navy/20"
            >
              <Upload className="w-4 h-4" />
              {currentCourse.resultsPublished ? 'Results Already Published' : 'Publish Results'}
            </button>
          </div>
        </section>
      )}

      {currentCourse && studentsInCourse.length === 0 && (
         <div className="p-8 text-center text-gray-500 font-medium bg-gray-50 border border-gray-200 rounded-xl">
           No students found enrolled in this course for the selected period.
         </div>
      )}

      {/* Confirmation Modal */}
      <Modal 
        isOpen={showConfirm} 
        onClose={() => setShowConfirm(false)}
        title="Confirm Publishing"
      >
        <div className="p-2 mb-6 flex gap-4">
          <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-navy mb-2">Are you sure you want to publish these results?</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Once published, students will be able to view their final grades and marks for <strong>{currentCourse?.name}</strong> on their Academic Report. This action cannot be easily undone.
            </p>
          </div>
        </div>
        <div className="flex w-full gap-3 justify-end pt-4 border-t border-gray-100">
           <button onClick={() => setShowConfirm(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
             Cancel
           </button>
           <button onClick={handlePublish} className="px-6 py-2.5 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light transition-all shadow-md focus:ring-4 focus:ring-navy/20">
             Yes, Publish Results
           </button>
        </div>
      </Modal>

    </div>
  );
}

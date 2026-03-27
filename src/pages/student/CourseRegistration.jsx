import { useState } from 'react';
import { COURSES } from '../../data/courses';
import Modal from '../../components/Modal';
import { Lock, Plus, Minus, CheckCircle, BookOpen, User, Hash, AlertTriangle, Layers, Globe, Clock, FileText, Info } from 'lucide-react';

const SEMESTER_COURSES = COURSES.filter(c => c.semester === 4 || c.category === 'uwe' || c.category === 'ccc');
const MAX_CREDITS = 25;

export default function CourseRegistration() {
  const initialSelected = SEMESTER_COURSES
    .filter(c => c.category === 'core')
    .map(c => c.code);

  const [selected, setSelected] = useState(initialSelected);
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [limitAlert, setLimitAlert] = useState(false);
  
  const [detailCourse, setDetailCourse] = useState(null);

  const totalCredits = SEMESTER_COURSES
    .filter(c => selected.includes(c.code))
    .reduce((sum, c) => sum + c.credits, 0);

  function toggle(code, credits) {
    const isSelected = selected.includes(code);
    if (!isSelected && totalCredits + credits > MAX_CREDITS) {
      setLimitAlert(true);
      return;
    }
    setSelected(prev =>
      isSelected ? prev.filter(c => c !== code) : [...prev, code]
    );
  }

  function handleFinalize() {
    setShowModal(false);
    setConfirmed(true);
  }

  const core = SEMESTER_COURSES.filter(c => c.category === 'core');
  const majorElective = SEMESTER_COURSES.filter(c => c.category === 'majorElective');
  const uwe = SEMESTER_COURSES.filter(c => c.category === 'uwe');
  const ccc = SEMESTER_COURSES.filter(c => c.category === 'ccc');

  const renderSection = (title, icon, description, coursesData) => {
    if (coursesData.length === 0) return null;
    return (
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
          <div className="p-1.5 bg-white rounded-md shadow-sm border border-gray-100">{icon}</div>
          <h3 className="text-sm font-extrabold text-navy uppercase tracking-wide">
            {title} <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-[10px]">{coursesData.length} courses</span>
          </h3>
          <span className="text-xs text-gray-400 font-medium hidden sm:inline ml-2 border-l border-gray-300 pl-3">{description}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coursesData.map(course => {
            const isSelected = selected.includes(course.code);
            return (
              <CourseCard
                key={course.code}
                course={course}
                isSelected={isSelected}
                isLocked={course.category === 'core'}
                onToggle={(e) => { e.stopPropagation(); toggle(course.code, course.credits); }}
                onOpenDetails={() => setDetailCourse(course)}
              />
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-extrabold text-navy">Course Registration</h2>
          <p className="text-sm font-medium text-gray-500 mt-2">Semester 4 · Spring 2026</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 flex items-center gap-2 ${
            totalCredits > MAX_CREDITS
              ? 'border-red-300 bg-red-50 text-red-700 shadow-sm'
              : 'border-gold bg-gold/10 text-navy shadow-sm'
          }`}>
            <span className="text-2xl">{totalCredits}</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">/ {MAX_CREDITS} CR</span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            disabled={totalCredits === 0}
            className="px-6 py-3.5 bg-navy text-white text-sm font-extrabold rounded-xl hover:bg-navy-light transition-smooth shadow-md disabled:opacity-50"
          >
            {confirmed ? 'Update Registration' : 'Finalize Registration'}
          </button>
        </div>
      </div>

      {confirmed && (
        <div className="mb-8 flex items-center gap-4 px-6 py-5 bg-emerald-50 border border-emerald-200 rounded-2xl animate-fade-in print:hidden shadow-sm">
          <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
          <div>
            <p className="text-lg font-extrabold text-emerald-900">Registration Confirmed</p>
            <p className="text-sm font-medium text-emerald-700 mt-1">
              You are officially enrolled in {selected.length} courses totalling {totalCredits} credits for the upcoming semester.
            </p>
          </div>
        </div>
      )}

      {renderSection("Core Courses", <Lock className="w-4 h-4 text-navy" />, "Pre-enrolled compulsory subjects", core)}
      {renderSection("Major Electives", <BookOpen className="w-4 h-4 text-gold" />, "Department specific specialization", majorElective)}
      {renderSection("UWE — University Wide Electives", <Globe className="w-4 h-4 text-emerald-600" />, "Cross-disciplinary subjects", uwe)}
      {renderSection("CCC — Core Common Curriculum", <Layers className="w-4 h-4 text-purple-600" />, "Mandatory foundational skills", ccc)}

      {/* Credit Limit Exceeded Modal */}
      <Modal
        isOpen={limitAlert}
        onClose={() => setLimitAlert(false)}
        title="Credit Limit Exceeded"
      >
        <div className="flex items-start gap-4 p-2 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-gray-800">
              You cannot add this course. It exceeds the maximum continuous workload of <strong className="text-red-600">{MAX_CREDITS} credits</strong>.
            </p>
            <p className="text-xs font-medium text-gray-500 mt-2 leading-relaxed">
              If you wish to take this course, you must drop an existing elective or UWE course first to free up credit space.
            </p>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button onClick={() => setLimitAlert(false)} className="px-6 py-2.5 bg-navy text-white text-sm font-extrabold rounded-xl hover:bg-navy-light shadow-md focus:ring-4 focus:ring-navy/20">
            Acknowledge
          </button>
        </div>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Course Registration"
      >
        <p className="text-sm font-medium text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
          You are about to lock in <strong>{selected.length} courses</strong> totalling <strong className="text-navy">{totalCredits} credits</strong> for the Spring 2026 semester.
        </p>
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 mb-6">
          {SEMESTER_COURSES.filter(c => selected.includes(c.code)).map(c => (
            <div key={c.code} className="flex items-center justify-between p-3 border border-gray-100 bg-white rounded-xl shadow-sm">
              <div>
                <p className="text-sm font-extrabold text-navy">{c.code} <span className="text-gray-400 font-medium ml-1">· {c.name}</span></p>
                <p className="text-xs font-medium text-gray-500 mt-1">{c.facultyName}</p>
              </div>
              <span className="text-xs font-extrabold text-gold bg-gold/10 px-2 py-1 rounded-md">{c.credits} cr</span>
            </div>
          ))}
        </div>
        
        <div className="flex w-full gap-3 pt-4 border-t border-gray-100">
           <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
             Review Changes
           </button>
           <button onClick={handleFinalize} className="flex-1 px-4 py-2.5 bg-navy text-white text-sm font-extrabold rounded-xl hover:bg-navy-light transition-all shadow-md focus:ring-4 focus:ring-navy/20">
             Confirm &amp; Register
           </button>
        </div>
      </Modal>

      {/* Course Detail Modal */}
      {detailCourse && (
        <Modal
          isOpen={!!detailCourse}
          onClose={() => setDetailCourse(null)}
          title="Course Information"
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-navy">{detailCourse.code}: {detailCourse.name}</h2>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="text-xs font-extrabold text-gold bg-gold/10 px-2.5 py-1 rounded-md border border-gold/20 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" /> {detailCourse.credits} Credits
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-200 uppercase tracking-widest">
                    {detailCourse.category}
                  </span>
                  {detailCourse.category === 'uwe' && detailCourse.department && (
                     <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                       Dept: {detailCourse.department}
                     </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{detailCourse.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><FileText className="w-4 h-4"/> Syllabus Topics</h4>
                 <ul className="space-y-2">
                   {detailCourse.syllabusTopics?.map((topic, i) => (
                     <li key={i} className="text-sm font-medium text-navy flex items-start gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0"></span> {topic}
                     </li>
                   ))}
                 </ul>
              </div>
              
              <div className="space-y-6">
                 <div>
                   <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><User className="w-4 h-4"/> Assigned Faculty</h4>
                   <p className="text-sm font-bold text-navy bg-white border border-gray-200 px-3 py-2 rounded-lg inline-block">{detailCourse.facultyName}</p>
                 </div>
                 
                 <div>
                   <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Clock className="w-4 h-4"/> Schedule</h4>
                   <p className="text-sm font-medium text-gray-700 bg-blue-50/50 border border-blue-100 px-3 py-2 rounded-lg">{detailCourse.schedule || 'Lecture: Mon 9:00 - 11:00 am'}</p>
                 </div>
              </div>
            </div>

            {detailCourse.gradedComponents && detailCourse.gradedComponents.length > 0 && (
              <div>
                <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Info className="w-4 h-4"/> Grading Breakdown</h4>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-bold text-gray-600">Component</th>
                        <th className="px-4 py-2 text-right font-bold text-gray-600">Weightage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailCourse.gradedComponents.map((gc, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-medium text-navy capitalize">{gc.type}</td>
                          <td className="px-4 py-2.5 text-right font-extrabold text-navy">{gc.weight}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-4">
              <button onClick={() => setDetailCourse(null)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all">Close</button>
              
              {detailCourse.category !== 'core' && (
                <button
                  onClick={() => {
                    toggle(detailCourse.code, detailCourse.credits);
                    if (!limitAlert) setDetailCourse(null);
                  }}
                  className={`px-6 py-2.5 text-sm font-extrabold rounded-xl transition-all shadow-md focus:ring-4 flex items-center gap-2 ${
                    selected.includes(detailCourse.code)
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 focus:ring-red-500/20'
                      : 'bg-navy text-white hover:bg-navy-light focus:ring-navy/20'
                  }`}
                >
                  {selected.includes(detailCourse.code) ? <><Minus className="w-4 h-4" /> Drop Course</> : <><Plus className="w-4 h-4" /> Enroll Course</>}
                </button>
               )}
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

function CourseCard({ course, isSelected, isLocked, onToggle, onOpenDetails }) {
  return (
    <div 
      onClick={onOpenDetails}
      className={`bg-white rounded-2xl border-2 p-5 flex flex-col justify-between transition-smooth cursor-pointer group ${
      isSelected ? 'border-navy shadow-card' : 'border-gray-200 hover:border-gold/50 shadow-sm'
    }`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-extrabold text-gold bg-gold/10 px-2.5 py-1 rounded-md border border-gold/20">{course.code}</span>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {course.category === 'uwe' && course.department && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wider">
                Dept: {course.departmentCode || course.department}
              </span>
            )}
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              course.category === 'core' ? 'bg-navy/10 text-navy' : 'bg-amber-100 text-amber-700'
            }`}>
              {course.category.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
        </div>
        
        <p className="text-[15px] leading-snug font-extrabold text-navy mb-2 group-hover:text-gold transition-colors">{course.name}</p>
        
        <div className="space-y-1.5 mb-5 mt-4">
          <p className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
            <User className="w-3.5 h-3.5 text-gray-400" /> {course.facultyName}
          </p>
          <p className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
            <Hash className="w-3.5 h-3.5 text-gray-400" /> {course.credits} Credits
          </p>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between print:hidden">
        <button className="text-[11px] font-extrabold text-navy hover:text-gold transition-colors uppercase tracking-widest">
          View Details →
        </button>
        {isLocked ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-gray-400 border border-gray-200">
            <Lock className="w-3 h-3" /> Core
          </div>
        ) : (
          <button
            onClick={onToggle}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-extrabold transition-smooth shadow-sm ${
              isSelected
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                : 'bg-navy text-white hover:bg-navy-light'
            }`}
          >
            {isSelected ? <><Minus className="w-3.5 h-3.5" /> Drop</> : <><Plus className="w-3.5 h-3.5" /> Add</>}
          </button>
        )}
      </div>
    </div>
  );
}

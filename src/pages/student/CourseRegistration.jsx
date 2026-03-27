import { useState } from 'react';
import { COURSES } from '../../data/courses';
import Modal from '../../components/Modal';
import { Lock, Plus, Minus, CheckCircle, BookOpen, User, Hash, AlertTriangle, Layers, Globe } from 'lucide-react';

// Current semester courses available for registration
const SEMESTER_COURSES = COURSES.filter(c => c.semester === 4);
const MAX_CREDITS = 25;

export default function CourseRegistration() {
  const initialSelected = SEMESTER_COURSES
    .filter(c => c.category === 'core')
    .map(c => c.code);

  const [selected, setSelected] = useState(initialSelected);
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [limitAlert, setLimitAlert] = useState(false);

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

  // helper to render course sections
  const renderSection = (title, icon, description, coursesData) => {
    if (coursesData.length === 0) return null;
    return (
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className="text-sm font-bold text-navy uppercase tracking-wide">{title}</h3>
          <span className="text-xs text-gray-400 font-medium hidden sm:inline">— {description}</span>
        </div>
        <div className="grid gap-3">
          {coursesData.map(course => {
            const isSelected = selected.includes(course.code);
            return (
              <CourseCard
                key={course.code}
                course={course}
                isSelected={isSelected}
                isLocked={course.category === 'core'}
                onToggle={() => toggle(course.code, course.credits)}
              />
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-navy">Course Registration</h2>
          <p className="text-sm text-gray-500 mt-1">Semester 4 · Spring 2026</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${
            totalCredits > MAX_CREDITS
              ? 'border-red-300 bg-red-50 text-red-700'
              : 'border-gold bg-gold/10 text-navy'
          }`}>
            <span className="text-xl">{totalCredits}</span>
            <span className="text-xs font-medium text-gray-500"> / {MAX_CREDITS} credits</span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            disabled={totalCredits === 0}
            className="px-5 py-2 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-navy-light transition-smooth shadow-sm disabled:opacity-50"
          >
            {confirmed ? 'Update Registration' : 'Finalize Registration'}
          </button>
        </div>
      </div>

      {confirmed && (
        <div className="mb-5 flex items-center gap-3 px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-slide-up print:hidden">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Registration Confirmed!</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              You are enrolled in {selected.length} courses totalling {totalCredits} credits.
            </p>
          </div>
        </div>
      )}

      {renderSection("Core Courses (Compulsory)", <Lock className="w-4 h-4 text-navy" />, "Pre-enrolled, cannot be dropped", core)}
      {renderSection("Major Electives", <BookOpen className="w-4 h-4 text-gold" />, "Department specific electives", majorElective)}
      {renderSection("UWE", <Globe className="w-4 h-4 text-emerald-600" />, "University Wide Electives", uwe)}
      {renderSection("CCC", <Layers className="w-4 h-4 text-purple-600" />, "Core Common Curriculum", ccc)}

      {/* Credit Limit Exceeded Modal */}
      <Modal
        isOpen={limitAlert}
        onClose={() => setLimitAlert(false)}
        title="Credit Limit Exceeded"
        footer={
          <button
            onClick={() => setLimitAlert(false)}
            className="px-5 py-2 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-navy-light transition-smooth"
          >
            Got it
          </button>
        }
      >
        <div className="flex items-start gap-4 p-2">
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-700">
              You can't add more courses since you've exceeded the credit limit of <strong>{MAX_CREDITS} credits</strong>.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Please drop an elective course before adding another one.
            </p>
          </div>
        </div>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Course Registration"
        footer={
          <>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-smooth"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalize}
              className="px-5 py-2 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-navy-light transition-smooth shadow-sm"
            >
              Confirm &amp; Register
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600 mb-4">
          You are about to register for <strong>{selected.length} courses</strong> totalling{' '}
          <strong>{totalCredits} credits</strong>.
        </p>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {SEMESTER_COURSES.filter(c => selected.includes(c.code)).map(c => (
            <div key={c.code} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-semibold text-navy">{c.code} — {c.name}</p>
                <p className="text-xs text-gray-500">{c.facultyName}</p>
              </div>
              <span className="text-xs font-bold text-gold">{c.credits} cr</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

function CourseCard({ course, isSelected, isLocked, onToggle }) {
  // Always allow dropping non-core courses
  return (
    <div className={`bg-white rounded-2xl border-2 p-4 flex items-center gap-4 transition-smooth print:border-gray-300 print:shadow-none ${
      isSelected ? 'border-navy shadow-card' : 'border-gray-100 hover:border-gray-200'
    }`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-md">{course.code}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            course.category === 'core' ? 'bg-navy/10 text-navy' : 'bg-amber-100 text-amber-700'
          }`}>
            {course.category.replace(/([A-Z])/g, ' $1').toUpperCase()}
          </span>
        </div>
        <p className="text-sm font-semibold text-navy mt-1">{course.name}</p>
        <div className="flex items-center gap-4 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <User className="w-3 h-3" /> {course.facultyName}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Hash className="w-3 h-3" /> {course.credits} credits
          </span>
        </div>
      </div>
      
      {/* Action button */}
      <div className="print:hidden">
        {isLocked ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-medium text-gray-500">
            <Lock className="w-3 h-3" /> Enrolled
          </div>
        ) : (
          <button
            onClick={onToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-smooth ${
              isSelected
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                : 'bg-navy text-white hover:bg-navy-light shadow-sm'
            }`}
          >
            {isSelected ? <><Minus className="w-3 h-3" /> Drop</> : <><Plus className="w-3 h-3" /> Add</>}
          </button>
        )}
      </div>
    </div>
  );
}

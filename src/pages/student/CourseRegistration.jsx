import { useState } from 'react';
import { COURSES } from '../../data/courses';
import Modal from '../../components/Modal';
import { Lock, Plus, Minus, CheckCircle, BookOpen, User, Hash } from 'lucide-react';

// Current semester courses available for registration
const SEMESTER_COURSES = COURSES.filter(c => c.semester === 4);
const MAX_CREDITS = 24;

export default function CourseRegistration() {
  // Compulsory courses pre-selected (locked), electives start un-selected
  const initialSelected = SEMESTER_COURSES
    .filter(c => c.type === 'Compulsory')
    .map(c => c.code);

  const [selected, setSelected] = useState(initialSelected);
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Calculate total selected credits
  const totalCredits = SEMESTER_COURSES
    .filter(c => selected.includes(c.code))
    .reduce((sum, c) => sum + c.credits, 0);

  function toggle(code) {
    setSelected(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  }

  function handleFinalize() {
    setShowModal(false);
    setConfirmed(true);
  }

  const compulsory = SEMESTER_COURSES.filter(c => c.type === 'Compulsory');
  const electives  = SEMESTER_COURSES.filter(c => c.type === 'Elective');

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Course Registration</h2>
          <p className="text-sm text-gray-500 mt-1">Semester 4 · Spring 2024</p>
        </div>

        {/* Credit counter badge */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${
            totalCredits > MAX_CREDITS
              ? 'border-red-300 bg-red-50 text-red-700'
              : 'border-gold bg-gold/10 text-navy'
          }`}>
            <span className="text-xl">{totalCredits}</span>
            <span className="text-xs font-medium text-gray-500"> / {MAX_CREDITS} credits</span>
          </div>

          {!confirmed && (
            <button
              onClick={() => setShowModal(true)}
              disabled={totalCredits === 0}
              className="px-5 py-2 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-navy-light transition-smooth shadow-sm disabled:opacity-50"
            >
              Finalize Registration
            </button>
          )}
        </div>
      </div>

      {/* Success banner */}
      {confirmed && (
        <div className="mb-5 flex items-center gap-3 px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-slide-up">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Registration Confirmed!</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              You are enrolled in {selected.length} courses totalling {totalCredits} credits for Semester 4.
            </p>
          </div>
        </div>
      )}

      {/* Compulsory courses */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-navy" />
          <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Compulsory Courses</h3>
          <span className="text-xs text-gray-400 font-medium">— Pre-enrolled, cannot be dropped</span>
        </div>
        <div className="grid gap-3">
          {compulsory.map(course => (
            <CourseCard
              key={course.code}
              course={course}
              isSelected
              isLocked
            />
          ))}
        </div>
      </section>

      {/* Elective courses */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Elective Courses</h3>
          <span className="text-xs text-gray-400 font-medium">— Choose up to {MAX_CREDITS - (compulsory.reduce((s,c)=>s+c.credits,0))} more credits</span>
        </div>
        <div className="grid gap-3">
          {electives.map(course => {
            const isSelected = selected.includes(course.code);
            const wouldExceed = !isSelected && (totalCredits + course.credits) > MAX_CREDITS;
            return (
              <CourseCard
                key={course.code}
                course={course}
                isSelected={isSelected}
                isLocked={false}
                onToggle={() => !confirmed && !wouldExceed && toggle(course.code)}
                disabled={confirmed || (wouldExceed && !isSelected)}
                wouldExceed={wouldExceed && !isSelected}
              />
            );
          })}
        </div>
      </section>

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
          <strong>{totalCredits} credits</strong>. This cannot be undone after the deadline.
        </p>
        <div className="space-y-2">
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

// ── CourseCard sub-component ──────────────────────────────────
function CourseCard({ course, isSelected, isLocked, onToggle, disabled, wouldExceed }) {
  return (
    <div className={`bg-white rounded-2xl border-2 p-4 flex items-center gap-4 transition-smooth ${
      isSelected ? 'border-navy shadow-card' : 'border-gray-100 hover:border-gray-200'
    } ${disabled && !isSelected ? 'opacity-60' : ''}`}>

      {/* Course info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-md">{course.code}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            course.type === 'Compulsory'
              ? 'bg-navy/10 text-navy'
              : 'bg-amber-100 text-amber-700'
          }`}>{course.type}</span>
        </div>
        <p className="text-sm font-semibold text-navy mt-1">{course.name}</p>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <User className="w-3 h-3" /> {course.facultyName}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Hash className="w-3 h-3" /> {course.credits} credits
          </span>
        </div>
      </div>

      {/* Action button */}
      {isLocked ? (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-medium text-gray-500">
          <Lock className="w-3 h-3" /> Enrolled
        </div>
      ) : (
        <button
          onClick={onToggle}
          disabled={disabled && !isSelected}
          title={wouldExceed ? 'Would exceed credit limit' : ''}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-smooth disabled:cursor-not-allowed ${
            isSelected
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              : 'bg-navy text-white hover:bg-navy-light shadow-sm'
          }`}
        >
          {isSelected ? <><Minus className="w-3 h-3" /> Drop</> : <><Plus className="w-3 h-3" /> Add</>}
        </button>
      )}
    </div>
  );
}

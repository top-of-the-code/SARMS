import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { COURSES } from '../../data/courses';
import Modal from '../../components/Modal';
import { useShowToast } from '../../components/Layout';
import { BookMarked, Users, Edit2, Plus, Trash2 } from 'lucide-react';

export default function CourseManagement() {
  const { currentUser } = useAuth();
  const showToast = useShowToast();

  const facultyCourses = COURSES.filter(c => c.facultyId === currentUser.id);

  const [editCourse, setEditCourse]     = useState(null); 
  const [localCourses, setLocalCourses] = useState(facultyCourses);
  const [formData, setFormData]         = useState({});
  const [newTopic, setNewTopic]         = useState('');

  function openEdit(course) {
    setEditCourse(course.code);
    setFormData({
      name: course.name,
      description: course.description,
      syllabusTopics: [...course.syllabusTopics],
      credits: course.credits,
    });
  }

  function saveEdit() {
    setLocalCourses(prev =>
      prev.map(c => c.code === editCourse ? { ...c, ...formData } : c)
    );
    setEditCourse(null);
    showToast(`Course updated successfully`, 'success');
  }

  function addTopic() {
    if (newTopic.trim()) {
      setFormData(d => ({ ...d, syllabusTopics: [...d.syllabusTopics, newTopic.trim()] }));
      setNewTopic('');
    }
  }

  function removeTopic(i) {
    setFormData(d => ({ ...d, syllabusTopics: d.syllabusTopics.filter((_, idx) => idx !== i) }));
  }

  const bySemester = localCourses.reduce((acc, c) => {
    acc[c.semester] = acc[c.semester] || [];
    acc[c.semester].push(c);
    return acc;
  }, {});

  const course = localCourses.find(c => c.code === editCourse);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-navy">My Courses</h2>
        <p className="text-sm font-medium text-gray-500 mt-1">
          Manage your course details and syllabus
        </p>
      </div>

      {Object.entries(bySemester).sort(([a],[b]) => Number(b)-Number(a)).map(([sem, courses]) => (
        <div key={sem} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-bold text-navy">Semester {sem}</h3>
            {courses.some(c=>c.activeSemester) && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 ml-2 shadow-sm">Current</span>
            )}
          </div>
          
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(c => (
              <div key={c.code} className="bg-white rounded-xl shadow-md border-t-4 border-t-gold p-6 flex flex-col gap-4 relative">
                
                {/* Header elements */}
                <div className="flex flex-col items-start gap-1">
                  <div className="w-full flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-gold uppercase tracking-wider">{c.code}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${c.activeSemester ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                      {c.activeSemester ? 'Active' : 'Past'}
                    </span>
                  </div>
                  <h4 className="text-xl font-extrabold text-gray-900 leading-tight">{c.name}</h4>
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="bg-navy/10 text-navy px-2.5 py-1 rounded-md">Semester {c.semester}</span>
                  <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">{c.type}</span>
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {c.enrolled}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {c.description}
                </p>

                {/* Syllabus Topics */}
                <div className="mt-2 flex-grow">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Syllabus Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {c.syllabusTopics.map(t => (
                      <span key={t} className="text-xs font-semibold px-2.5 py-1 bg-navy text-white rounded-full shadow-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-navy text-sm font-bold rounded-xl border border-gray-200 hover:bg-navy hover:text-white transition-all shadow-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editCourse}
        onClose={() => setEditCourse(null)}
        title={`Edit Course Details`}
        size="lg"
        footer={
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button 
               onClick={saveEdit} 
               className="w-full sm:w-auto flex-1 px-5 py-3 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light transition-all shadow-md focus:ring-4 focus:ring-navy/20 order-1 sm:order-2"
            >
              Save Changes
            </button>
            <button 
               onClick={() => setEditCourse(null)} 
               className="w-full sm:w-auto px-5 py-3 bg-white text-gray-700 text-sm font-bold rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all focus:ring-4 focus:ring-gray-100 order-2 sm:order-1"
            >
              Cancel / Discard Changes
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
             {/* Course Name */}
             <div className="flex-1">
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Course Name</label>
               <input
                 type="text"
                 value={formData.name || ''}
                 onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 font-medium text-navy transition-all"
               />
             </div>
             {/* Credits */}
             <div className="w-full sm:w-32">
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Credits</label>
               <input
                 type="number" min={1} max={6}
                 value={formData.credits || ''}
                 onChange={e => setFormData(d => ({ ...d, credits: Number(e.target.value) }))}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 font-medium text-navy transition-all text-center"
               />
             </div>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 font-medium text-navy transition-all resize-none"
            />
          </div>
          
          {/* Syllabus topics */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-3">Syllabus Topics</label>
            <div className="flex flex-wrap gap-2.5 mb-4 p-4 bg-gray-50 border border-gray-100 rounded-xl min-h-[60px]">
              {(formData.syllabusTopics || []).map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-navy text-white rounded-full font-semibold shadow-sm animate-fade-in text-left">
                  {t}
                  <button onClick={() => removeTopic(i)} className="text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-red-500 rounded-full p-0.5" title="Remove topic">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {formData.syllabusTopics?.length === 0 && <span className="text-sm text-gray-400 font-medium italic">No topics added.</span>}
            </div>
            <div className="flex gap-2 relative">
              <input
                type="text" value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                placeholder="Type a new topic and press Add (or Enter)..."
                className="flex-1 px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 font-medium text-navy transition-all"
              />
              <button
                onClick={addTopic}
                className="px-5 py-2.5 bg-gold text-navy text-sm font-bold rounded-xl hover:bg-gold-light transition-all shadow-sm focus:ring-4 focus:ring-gold/30"
              >
                Add Topic
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

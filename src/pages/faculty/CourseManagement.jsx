import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { COURSES } from '../../data/courses';
import Modal from '../../components/Modal';
import { useShowToast } from '../../components/Layout';
import { BookMarked, Users, Edit2, Trash2 } from 'lucide-react';

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
    const gc = course.gradedComponents || [];
    const graded = {
      quiz: { enabled: false, m: '', n: '', weight: '' },
      assignment: { enabled: false, m: '', n: '', weight: '' },
      project: { enabled: false, parts: [] },
      midsem: { enabled: false, weight: '' },
      endsem: { enabled: false, weight: '' }
    };
    
    gc.forEach(c => {
      if (c.type === 'Quiz') graded.quiz = { enabled: true, m: c.m, n: c.n, weight: c.weight };
      if (c.type === 'Assignment') graded.assignment = { enabled: true, m: c.m, n: c.n, weight: c.weight };
      if (c.type === 'Project') graded.project = { enabled: true, parts: c.parts || [] };
      if (c.type === 'Midsem') graded.midsem = { enabled: true, weight: c.weight };
      if (c.type === 'Endsem') graded.endsem = { enabled: true, weight: c.weight };
    });

    setFormData({
      name: course.name,
      description: course.description,
      syllabusTopics: [...(course.syllabusTopics || [])],
      credits: course.credits,
      graded
    });
  }

  function saveEdit() {
    const g = formData.graded;
    const finalComponents = [];
    if (g.quiz.enabled) finalComponents.push({ type: 'Quiz', m: Number(g.quiz.m), n: Number(g.quiz.n), weight: Number(g.quiz.weight) });
    if (g.assignment.enabled) finalComponents.push({ type: 'Assignment', m: Number(g.assignment.m), n: Number(g.assignment.n), weight: Number(g.assignment.weight) });
    if (g.project.enabled) finalComponents.push({ type: 'Project', parts: g.project.parts.map(p=>({name: p.name, weight: Number(p.weight)})) });
    if (g.midsem.enabled) finalComponents.push({ type: 'Midsem', weight: Number(g.midsem.weight) });
    if (g.endsem.enabled) finalComponents.push({ type: 'Endsem', weight: Number(g.endsem.weight) });

    setLocalCourses(prev =>
      prev.map(c => c.code === editCourse ? { ...c, ...formData, gradedComponents: finalComponents } : c)
    );
    setEditCourse(null);
    showToast(`Course updated successfully`, 'success');
  }

  function addTopic() {
    if (newTopic.trim()) {
      setFormData(d => ({ ...d, syllabusTopics: [...(d.syllabusTopics||[]), newTopic.trim()] }));
      setNewTopic('');
    }
  }

  function removeTopic(i) {
    setFormData(d => ({ ...d, syllabusTopics: d.syllabusTopics.filter((_, idx) => idx !== i) }));
  }

  function updateGraded(key, nestedObj) {
    setFormData(d => ({ ...d, graded: { ...d.graded, [key]: nestedObj } }));
  }

  const bySemester = localCourses.reduce((acc, c) => {
    acc[c.semester] = acc[c.semester] || [];
    acc[c.semester].push(c);
    return acc;
  }, {});

  const course = localCourses.find(c => c.code === editCourse);

  // Calculate Running Total
  let totalPerc = 0;
  if (formData.graded) {
    const g = formData.graded;
    if (g.quiz.enabled) totalPerc += Number(g.quiz.weight || 0);
    if (g.assignment.enabled) totalPerc += Number(g.assignment.weight || 0);
    if (g.project.enabled) {
      g.project.parts.forEach(p => totalPerc += Number(p.weight || 0));
    }
    if (g.midsem.enabled) totalPerc += Number(g.midsem.weight || 0);
    if (g.endsem.enabled) totalPerc += Number(g.endsem.weight || 0);
  }
  const isTotalValid = totalPerc === 100;

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
                   <span className="bg-navy/10 text-navy px-2.5 py-1 rounded-md">
                     {c.semesterType || ''} {c.year}
                   </span>
                   <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                     {c.category ? c.category.toUpperCase() : c.type}
                   </span>
                   <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md flex items-center gap-1">
                     <Users className="w-3.5 h-3.5" />
                     {c.enrolled}
                   </span>
                </div>

                {/* Status for pending courses */}
                {(!c.description || (c.gradedComponents && c.gradedComponents.length === 0)) && (
                   <div className="bg-red-50 text-red-700 text-xs font-bold px-3 py-2 rounded-lg border border-red-200">
                     Pending — Awaiting Course Details
                   </div>
                )}

                {/* Description */}
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {c.description}
                </p>

                {/* Syllabus Topics */}
                <div className="mt-2 flex-grow">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Syllabus Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {(c.syllabusTopics || []).map(t => (
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
               disabled={!isTotalValid}
               className="w-full sm:w-auto flex-1 px-5 py-3 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light transition-all shadow-md focus:ring-4 focus:ring-navy/20 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              Save Changes
            </button>
            <button 
               onClick={() => setEditCourse(null)} 
               className="w-full sm:w-auto px-5 py-3 bg-white text-gray-700 text-sm font-bold rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all focus:ring-4 focus:ring-gray-100 order-2 sm:order-1"
            >
              Cancel
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-1">
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Course Name</label>
               <input
                 type="text"
                 value={formData.name || ''}
                 onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 font-medium text-navy transition-all"
               />
             </div>
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
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 font-medium text-navy transition-all resize-none"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Syllabus Topics</label>
            <div className="flex flex-wrap gap-2.5 mb-3 p-4 bg-gray-50 border border-gray-100 rounded-xl min-h-[60px]">
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
                placeholder="Type a new topic and press Add..."
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

          {/* Graded Components Section */}
          <div className="border-t-2 border-gray-100 pt-6 mt-6">
             <div className="flex items-center justify-between mb-4">
               <div>
                 <h3 className="text-lg font-bold text-navy">Graded Components</h3>
                 <p className="text-xs text-gray-500 font-medium">Define continuous assessment and exams.</p>
               </div>
               <div className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${isTotalValid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-300'}`}>
                 Total: {totalPerc}% / 100%
               </div>
             </div>

             {formData.graded && (
               <div className="space-y-4">
                 
                 {/* Quiz */}
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                   <div className="flex flex-wrap items-center gap-4">
                     <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-navy w-32">
                       <input type="checkbox" checked={formData.graded.quiz.enabled} onChange={e => updateGraded('quiz', {...formData.graded.quiz, enabled: e.target.checked})} className="w-4 h-4 rounded text-gold focus:ring-gold" />
                       Quiz
                     </label>
                     {formData.graded.quiz.enabled && (
                       <div className="flex flex-1 items-center gap-3 flex-wrap">
                         <div className="flex items-center gap-2">
                           <span className="text-xs font-medium text-gray-600">Best</span>
                           <input type="number" min="1" value={formData.graded.quiz.n} onChange={e => updateGraded('quiz', {...formData.graded.quiz, n: e.target.value})} className="w-14 px-2 py-1 text-sm border border-gray-300 rounded focus:border-gold outline-none" placeholder="n" />
                           <span className="text-xs font-medium text-gray-600">out of</span>
                           <input type="number" min="1" value={formData.graded.quiz.m} onChange={e => updateGraded('quiz', {...formData.graded.quiz, m: e.target.value})} className="w-14 px-2 py-1 text-sm border border-gray-300 rounded focus:border-gold outline-none" placeholder="m" />
                         </div>
                         <div className="flex items-center gap-2 ml-auto">
                           <span className="text-xs font-medium text-gray-600">Weight %</span>
                           <input type="number" min="0" max="100" value={formData.graded.quiz.weight} onChange={e => updateGraded('quiz', {...formData.graded.quiz, weight: e.target.value})} className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:border-gold outline-none" />
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Assignment */}
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                   <div className="flex flex-wrap items-center gap-4">
                     <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-navy w-32">
                       <input type="checkbox" checked={formData.graded.assignment.enabled} onChange={e => updateGraded('assignment', {...formData.graded.assignment, enabled: e.target.checked})} className="w-4 h-4 rounded text-gold focus:ring-gold" />
                       Assignment
                     </label>
                     {formData.graded.assignment.enabled && (
                       <div className="flex flex-1 items-center gap-3 flex-wrap">
                         <div className="flex items-center gap-2">
                           <span className="text-xs font-medium text-gray-600">Best</span>
                           <input type="number" min="1" value={formData.graded.assignment.n} onChange={e => updateGraded('assignment', {...formData.graded.assignment, n: e.target.value})} className="w-14 px-2 py-1 text-sm border border-gray-300 rounded focus:border-gold outline-none" placeholder="n" />
                           <span className="text-xs font-medium text-gray-600">out of</span>
                           <input type="number" min="1" value={formData.graded.assignment.m} onChange={e => updateGraded('assignment', {...formData.graded.assignment, m: e.target.value})} className="w-14 px-2 py-1 text-sm border border-gray-300 rounded focus:border-gold outline-none" placeholder="m" />
                         </div>
                         <div className="flex items-center gap-2 ml-auto">
                           <span className="text-xs font-medium text-gray-600">Weight %</span>
                           <input type="number" min="0" max="100" value={formData.graded.assignment.weight} onChange={e => updateGraded('assignment', {...formData.graded.assignment, weight: e.target.value})} className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:border-gold outline-none" />
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Project */}
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                   <div className="flex flex-wrap items-start gap-4 mb-2">
                     <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-navy w-32 mt-1">
                       <input type="checkbox" checked={formData.graded.project.enabled} onChange={e => updateGraded('project', {...formData.graded.project, enabled: e.target.checked})} className="w-4 h-4 rounded text-gold focus:ring-gold" />
                       Project
                     </label>
                     {formData.graded.project.enabled && (
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-3">
                           <span className="text-xs font-medium text-gray-600">Number of components</span>
                           <input type="number" min="0" value={formData.graded.project.parts.length} onChange={e => {
                             let cnt = Number(e.target.value);
                             const newParts = [...formData.graded.project.parts];
                             if (cnt > newParts.length) {
                               for(let i=newParts.length; i<cnt; i++) newParts.push({name:'', weight:''});
                             } else {
                               newParts.length = cnt;
                             }
                             updateGraded('project', {...formData.graded.project, parts: newParts});
                           }} className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:border-gold outline-none" />
                         </div>
                         <div className="space-y-2">
                           {formData.graded.project.parts.map((p, i) => (
                             <div key={i} className="flex gap-2">
                               <input type="text" placeholder="Component Name (e.g. Presentation)" value={p.name} onChange={e => {
                                 const np = [...formData.graded.project.parts];
                                 np[i].name = e.target.value;
                                 updateGraded('project', {...formData.graded.project, parts: np});
                               }} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:border-gold outline-none" />
                               <div className="flex items-center gap-2 shrink-0">
                                 <span className="text-xs font-medium text-gray-600">Weight %</span>
                                 <input type="number" min="0" max="100" value={p.weight} onChange={e => {
                                   const np = [...formData.graded.project.parts];
                                   np[i].weight = e.target.value;
                                   updateGraded('project', {...formData.graded.project, parts: np});
                                 }} className="w-16 px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-gold outline-none" />
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Midsem */}
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                   <div className="flex flex-wrap items-center gap-4">
                     <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-navy w-32">
                       <input type="checkbox" checked={formData.graded.midsem.enabled} onChange={e => updateGraded('midsem', {...formData.graded.midsem, enabled: e.target.checked})} className="w-4 h-4 rounded text-gold focus:ring-gold" />
                       Midsem Exam
                     </label>
                     {formData.graded.midsem.enabled && (
                       <div className="flex flex-1 justify-end items-center gap-2">
                         <span className="text-xs font-medium text-gray-600">Weight %</span>
                         <input type="number" min="0" max="100" value={formData.graded.midsem.weight} onChange={e => updateGraded('midsem', {...formData.graded.midsem, weight: e.target.value})} className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:border-gold outline-none" />
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Endsem */}
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                   <div className="flex flex-wrap items-center gap-4">
                     <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-navy w-32">
                       <input type="checkbox" checked={formData.graded.endsem.enabled} onChange={e => updateGraded('endsem', {...formData.graded.endsem, enabled: e.target.checked})} className="w-4 h-4 rounded text-gold focus:ring-gold" />
                       Endsem Exam
                     </label>
                     {formData.graded.endsem.enabled && (
                       <div className="flex flex-1 justify-end items-center gap-2">
                         <span className="text-xs font-medium text-gray-600">Weight %</span>
                         <input type="number" min="0" max="100" value={formData.graded.endsem.weight} onChange={e => updateGraded('endsem', {...formData.graded.endsem, weight: e.target.value})} className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:border-gold outline-none" />
                       </div>
                     )}
                   </div>
                 </div>

               </div>
             )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

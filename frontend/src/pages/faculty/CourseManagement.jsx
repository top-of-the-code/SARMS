import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTermConfig } from '../../context/TermConfigContext';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { useShowToast } from '../../components/Layout';
import { BookMarked, Users, Edit2, Trash2 } from 'lucide-react';

export default function CourseManagement() {
  const { currentUser } = useAuth();
  const { termConfig } = useTermConfig();
  const showToast = useShowToast();

  const [localCourses, setLocalCourses] = useState([]);
  const [editCourse, setEditCourse]     = useState(null); 
  const [formData, setFormData]         = useState({});
  const [newTopic, setNewTopic]         = useState('');
  const activeSemInfo = termConfig || { type: 'Spring', year: 2026 };

  useEffect(() => {
    api.get(`/courses?facultyId=${currentUser.id}`)
      .then(res => setLocalCourses(res.data))
      .catch(() => showToast('Failed to load courses', 'error'));
  }, [currentUser.id]);

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
      if (c.id === 'quiz') {
         graded.quiz.enabled = true; graded.quiz.weight = c.weight;
         const match = c.name?.match(/Best (\d+) of (\d+)/);
         if (match) { graded.quiz.n = match[1]; graded.quiz.m = match[2]; }
      } else if (c.id === 'assign') {
         graded.assignment.enabled = true; graded.assignment.weight = c.weight;
         const match = c.name?.match(/Best (\d+) of (\d+)/);
         if (match) { graded.assignment.n = match[1]; graded.assignment.m = match[2]; }
      } else if (c.id && c.id.startsWith('proj_')) {
         graded.project.enabled = true;
         graded.project.parts.push({ name: c.name, weight: c.weight });
      } else if (c.id === 'midsem') {
         graded.midsem.enabled = true; graded.midsem.weight = c.weight;
      } else if (c.id === 'endsem') {
         graded.endsem.enabled = true; graded.endsem.weight = c.weight;
      }
    });

    setFormData({
      name: course.name,
      description: course.description,
      syllabusTopics: [...(course.syllabusTopics || [])],
      credits: course.credits,
      graded
    });
  }

  async function saveEdit() {
    const g = formData.graded;
    const finalComponents = [];
    if (g.quiz.enabled) finalComponents.push({ id: 'quiz', name: g.quiz.n && g.quiz.m ? `Best ${g.quiz.n} of ${g.quiz.m} Quizzes` : 'Quizzes', weight: Number(g.quiz.weight) });
    if (g.assignment.enabled) finalComponents.push({ id: 'assign', name: g.assignment.n && g.assignment.m ? `Best ${g.assignment.n} of ${g.assignment.m} Assignments` : 'Assignments', weight: Number(g.assignment.weight) });
    if (g.project.enabled) g.project.parts.forEach((p, i) => finalComponents.push({ id: `proj_${i}`, name: p.name || `Project Part ${i+1}`, weight: Number(p.weight) }));
    if (g.midsem.enabled) finalComponents.push({ id: 'midsem', name: 'Midsem Exam', weight: Number(g.midsem.weight) });
    if (g.endsem.enabled) finalComponents.push({ id: 'endsem', name: 'Endsem Exam', weight: Number(g.endsem.weight) });

    const updates = { ...formData, gradedComponents: finalComponents };

    try {
      const res = await api.put(`/courses/${editCourse}`, updates);
      setLocalCourses(prev => prev.map(c => c.code === editCourse ? res.data : c));
      await api.put(`/marks/${editCourse}/components`, finalComponents).catch(() => {});
      setEditCourse(null);
      showToast(`Course updated successfully`, 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update course', 'error');
    }
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

  // Change 10: Show all courses. Mark inactive ones based on active term.
  const coursesWithStatus = localCourses.map(c => {
    let isActiveTerm = false;
    if (activeSemInfo.type === 'Spring') isActiveTerm = c.semester % 2 === 0;
    else if (activeSemInfo.type === 'Monsoon') isActiveTerm = c.semester % 2 !== 0;
    else isActiveTerm = true;
    return { ...c, isActiveTerm };
  });

  // Change 5: Group CCC and UWE into 'Semester-Agnostic'
  const bySemester = coursesWithStatus.reduce((acc, c) => {
    const isAgnostic = ['ccc', 'uwe'].includes(c.category);
    const key = isAgnostic ? 'Agnostic' : c.semester;
    acc[key] = acc[key] || [];
    acc[key].push(c);
    return acc;
  }, {});

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
  
  let validComponents = true;
  let componentError = '';
  
  if (formData.graded?.quiz?.enabled) {
     if (Number(formData.graded.quiz.n) > Number(formData.graded.quiz.m)) { validComponents = false; componentError = 'Quiz: Best count cannot exceed total count'; }
  }
  if (formData.graded?.assignment?.enabled) {
     if (Number(formData.graded.assignment.n) > Number(formData.graded.assignment.m)) { validComponents = false; componentError = 'Assignment: Best count cannot exceed total count'; }
  }
  if (formData.graded?.project?.enabled) {
     if (formData.graded.project.parts.some(p => !p.name || !p.name.trim())) { validComponents = false; componentError = 'Project: Component names cannot be empty'; }
  }

  // Basic validation
  const isValidForm = isTotalValid && validComponents &&
                      formData.name?.trim().length > 0 && 
                      formData.description?.trim().length > 0 && 
                      formData.credits > 0;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-navy">My Courses</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Manage your course details and syllabus
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 shadow-sm">
          <BookMarked className="w-3.5 h-3.5 text-gold" />
          <span>Current Term: {activeSemInfo.type} {activeSemInfo.year}</span>
        </div>
      </div>

      <div className="space-y-8">
        {Object.keys(bySemester).sort().map(semKey => (
          <div key={semKey} className="animate-fade-in">
            <h3 className="text-xl font-black text-navy border-b-2 border-navy/10 pb-3 mb-5 flex items-center gap-3 w-max">
              <span className="w-8 h-8 rounded-xl bg-gold/20 text-gold flex items-center justify-center text-sm font-black tracking-tighter shadow-sm">{semKey === 'Agnostic' ? '∞' : semKey}</span>
              {semKey === 'Agnostic' ? 'Semester-Agnostic Courses (CCC/UWE)' : `Semester ${semKey}`}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bySemester[semKey].map(c => (
                <div key={c.code} className={`bg-white rounded-2xl shadow-card border-2 transition-all p-6 relative overflow-hidden group ${!c.isActiveTerm ? 'border-gray-200 opacity-60' : (c.status === 'Pending' ? 'border-amber-200 hover:border-amber-300' : 'border-gray-100 hover:border-gold hover:shadow-lg')}`}>
                  {/* Status ribbon */}
                  {c.status === 'Pending' && c.isActiveTerm && (
                    <div className="absolute top-4 right-4 text-[10px] uppercase font-black bg-amber-100 text-amber-700 px-2 py-1 rounded shadow-sm">Setup Required</div>
                  )}
                  {!c.isActiveTerm && (
                    <div className="absolute top-4 right-4 text-[10px] uppercase font-black bg-gray-200 text-gray-600 px-2 py-1 rounded shadow-sm">Inactive</div>
                  )}

                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-navy/5 flex flex-col items-center justify-center shrink-0 shadow-sm border border-navy/10">
                      <span className="text-xs font-black text-navy">{c.departmentCode}</span>
                      <span className="text-[10px] font-bold text-gray-400">{c.code.replace(c.departmentCode, '')}</span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-navy text-lg leading-tight line-clamp-2" title={c.name}>{c.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{c.department} <span className="mx-1">•</span> {c.credits} Cr</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium mb-5 h-10 whitespace-pre-line">{c.description || 'No description provided.'}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-extrabold text-gray-400 mb-1">
                        <Users className="w-3 h-3 text-gold" /> Enrolled
                      </div>
                      <p className="text-sm font-black text-navy">{c.enrolled || 0} Students</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-extrabold text-gray-400 mb-1">
                        <BookMarked className="w-3 h-3 text-gold" /> Components
                      </div>
                      <p className="text-sm font-black text-navy">{c.gradedComponents?.length || 0} Configured</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openEdit(c)}
                    disabled={!c.isActiveTerm}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-navy font-bold text-sm rounded-xl hover:bg-navy hover:text-white transition-all focus:ring-4 focus:ring-navy/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-navy/5"
                  >
                    <Edit2 className="w-4 h-4" /> Edit Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}</div>

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
               disabled={!isValidForm}
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
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
            <textarea 
              value={formData.description || ''} 
              onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
              placeholder="Enter full course description..."
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-navy focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all resize-none shadow-inner"
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
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
               <div>
                 <h3 className="text-lg font-bold text-navy">Graded Components</h3>
                 <p className="text-xs text-gray-500 font-medium">Define continuous assessment and exams.</p>
               </div>
               <div className="flex flex-col items-end gap-1">
                 {componentError && <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">{componentError}</span>}
                 <div className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${isTotalValid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-300'}`}>
                   Total: {totalPerc}% / 100%
                 </div>
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

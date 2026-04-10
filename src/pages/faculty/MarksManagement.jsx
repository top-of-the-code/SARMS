import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getGrade } from '../../data/courses';
import { calcWeightedTotal } from '../../data/marksManagement';
import { useShowToast } from '../../components/Layout';
import { Lock, Save, ChevronDown, Search } from 'lucide-react';
import { useTermConfig } from '../../context/TermConfigContext';

function GradeBadge({ grade }) {
  const map = {
    'A+': 'bg-emerald-100 text-emerald-700',
    'A': 'bg-green-100 text-green-700',
    'B+': 'bg-blue-100 text-blue-700',
    'B': 'bg-sky-100 text-sky-700',
    'C': 'bg-yellow-100 text-yellow-700',
    'D': 'bg-orange-100 text-orange-700',
    'F': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${map[grade] || 'bg-gray-100 text-gray-600'}`}>
      {grade}
    </span>
  );
}

export default function MarksManagement() {
  const { currentUser } = useAuth();
  const showToast = useShowToast();
  const { termConfig } = useTermConfig();

  const [facultyCourses, setFacultyCourses] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [courseData, setCourseData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get(`/courses?facultyId=${currentUser.id}`)
      .then(res => {
        setFacultyCourses(res.data);
        if (res.data.length > 0) {
          setSelectedCode(res.data[0].code);
        }
      })
      .catch(err => showToast('Failed to load courses', 'error'));
  }, [currentUser.id]);

  useEffect(() => {
    if (selectedCode) {
      api.get(`/marks/${selectedCode}`)
        .then(res => setCourseData(res.data))
        .catch(err => setCourseData(null));
    } else {
      setCourseData(null);
    }
  }, [selectedCode]);

  const allLocked = courseData?.studentMarks?.length > 0 && courseData.studentMarks.every(s => s.locked);

  function updateMark(rollNo, compId, value) {
    const targetStudent = courseData?.studentMarks?.find(s => s.rollNo === rollNo);
    if (targetStudent?.locked) return;
    setCourseData(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated.studentMarks = updated.studentMarks.map(student => {
        if (student.rollNo === rollNo) {
          return {
            ...student,
            marks: { ...student.marks, [compId]: value === '' ? null : Number(value) }
          };
        }
        return student;
      });
      return updated;
    });
  }

  async function handleSaveAll() {
    if (!courseData) return;
    try {
      await api.put(`/marks/${selectedCode}`, courseData.studentMarks);
      showToast(`Marks updated successfully for ${selectedCode}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update marks', 'error');
    }
  }

  const filteredStudents = courseData?.studentMarks?.filter(student => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return student.name.toLowerCase().includes(q) || student.rollNo.toLowerCase().includes(q);
  }) || [];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-navy">Marks Management</h2>
        <p className="text-sm font-medium text-gray-500 mt-2">
          Select a course below to view or manage student marks
        </p>
      </div>

      <div className="relative inline-block w-full max-w-sm mb-8">
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="appearance-none w-full px-5 py-3.5 text-sm font-bold text-navy bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-navy/20 focus:border-navy transition-all cursor-pointer"
        >
          {(() => {
            const activeSemInfo = termConfig || { type: 'Spring', year: 2026 };
            const processed = [...facultyCourses].map(c => {
              let isActiveTerm = false;
              const isTermValid = ['Both', activeSemInfo.type].includes(c.semesterType);
              if (isTermValid) {
                if (activeSemInfo.type === 'Spring') isActiveTerm = c.semester % 2 === 0;
                else if (activeSemInfo.type === 'Monsoon') isActiveTerm = c.semester % 2 !== 0;
                else isActiveTerm = true;
              }
              if (['ccc', 'uwe'].includes(c.category)) isActiveTerm = isTermValid;
              return { ...c, computedActive: isActiveTerm };
            }).sort((a, b) => (b.computedActive ? 1 : 0) - (a.computedActive ? 1 : 0));

            return processed.map(c => {
              let labelSuffix = '';
              if (!c.computedActive) labelSuffix = ' (Inactive)';
              return (
                <option 
                  key={c.code} 
                  value={c.code} 
                  style={{ color: !c.computedActive ? '#9ca3af' : 'inherit' }}
                >
                  {c.code}, {c.name}{labelSuffix}
                </option>
              );
            });
          })()}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-navy">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {!courseData && (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl shadow-card">
          <p className="text-lg text-gray-400 font-bold">No marks data found for this course.</p>
        </div>
      )}

      {courseData && (
        <div className="flex-1 flex flex-col min-h-0 relative">

          {/* Removed full course-level locked banner. Row-level locks apply instead. */}
          <div className="bg-white rounded-xl overflow-hidden shadow-card border border-gray-200 flex-1 flex flex-col min-h-0">

            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search students by name or roll no..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 font-medium text-navy transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-sm min-w-[800px] border-collapse">
                <thead className="bg-navy sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-white/10">Roll No</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-white/10">Name</th>
                    {courseData.gradingComponents.map(comp => {
                      const match = comp.name?.match(/Best (\d+) of (\d+)/);
                      if (match) {
                        const N = parseInt(match[1], 10);
                        const M = parseInt(match[2], 10);
                        return Array.from({ length: M }).map((_, idx) => (
                          <th key={`${comp.id}_${idx}`} className="text-center px-4 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-white/10 whitespace-nowrap">
                            {comp.name.replace(/Best \d+ of \d+ /, '')} {idx + 1}
                            <div className="text-[10px] text-white/60 normal-case mt-0.5 font-medium">(Best {N}/{M} to Max {comp.weight})</div>
                          </th>
                        ));
                      } else {
                        return (
                          <th key={comp.id} className="text-center px-5 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-white/10 whitespace-nowrap">
                            {comp.name}
                            <div className="text-[10px] text-white/60 normal-case mt-0.5 font-medium">(Max {comp.weight})</div>
                          </th>
                        );
                      }
                    })}
                    <th className="text-center px-5 py-4 text-xs font-bold text-white uppercase tracking-wider border-r border-white/10">Total %</th>
                    <th className="text-center px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={courseData.gradingComponents.length + 4} className="text-center py-10">
                        <p className="text-gray-500 font-medium">No students found matching your search.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, i) => {
                      const total = calcWeightedTotal(student.marks, courseData.gradingComponents);
                      const { letter } = getGrade(total);
                      return (
                        <tr key={student.rollNo} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gold/5 transition-colors border-b border-gray-200`}>
                          <td className="px-6 py-4 font-mono text-sm font-bold text-gray-600 border-r border-gray-200">{student.rollNo}</td>
                          <td className="px-6 py-4 font-bold text-navy border-r border-gray-200">{student.name}</td>

                          {courseData.gradingComponents.map(comp => {
                            const match = comp.name?.match(/Best (\d+) of (\d+)/);
                            if (match) {
                               const M = parseInt(match[2], 10);
                               return Array.from({ length: M }).map((_, idx) => {
                                 const subId = `${comp.id}_${idx}`;
                                 return (
                                   <td key={subId} className="text-center px-3 py-3 border-r border-gray-200 bg-white/50 relative">
                                     {student.locked ? (
                                       <div className="flex justify-center items-center h-full">
                                         <span className="text-gray-400 font-medium">{student.marks[subId] ?? '--'}</span>
                                       </div>
                                     ) : (
                                       <input
                                         type="number"
                                         min={0}
                                         value={student.marks[subId] === null || student.marks[subId] === undefined ? '' : student.marks[subId]}
                                         onChange={(e) => updateMark(student.rollNo, subId, e.target.value)}
                                         className="w-full h-full min-w-[60px] text-center bg-transparent border-2 border-transparent px-2 py-1.5 focus:border-gold focus:bg-white focus:shadow-inner rounded-md transition-all font-semibold text-navy outline-none placeholder-gray-300"
                                         placeholder="--"
                                       />
                                     )}
                                   </td>
                                 );
                               });
                            } else {
                               return (
                                 <td key={comp.id} className="text-center px-3 py-3 border-r border-gray-200 bg-white/50 relative">
                                   {student.locked ? (
                                     <div className="flex justify-center items-center h-full">
                                       <span className="text-gray-400 font-medium">{student.marks[comp.id] ?? '--'}</span>
                                     </div>
                                   ) : (
                                     <input
                                       type="number"
                                       min={0} max={100}
                                       value={student.marks[comp.id] === null || student.marks[comp.id] === undefined ? '' : student.marks[comp.id]}
                                       onChange={(e) => updateMark(student.rollNo, comp.id, e.target.value)}
                                       className="w-full h-full min-w-[60px] text-center bg-transparent border-2 border-transparent px-2 py-1.5 focus:border-gold focus:bg-white focus:shadow-inner rounded-md transition-all font-semibold text-navy outline-none placeholder-gray-300"
                                       placeholder="--"
                                     />
                                   )}
                                 </td>
                               );
                            }
                          })}

                          <td className="text-center px-5 py-4 font-extrabold text-navy border-r border-gray-200">{total}</td>
                          <td className="text-center px-5 py-4">
                            {student.locked ? (
                              <div className="flex items-center justify-center gap-2 opacity-70">
                                <GradeBadge grade={letter} />
                                <Lock className="w-3.5 h-3.5 text-gray-400" />
                              </div>
                            ) : (
                              <GradeBadge grade={letter} />
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!allLocked && (
              <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-20 sticky bottom-0">
                <button
                  onClick={handleSaveAll}
                  className="flex items-center gap-2 px-8 py-3 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light focus:ring-4 focus:ring-navy/20 transition-all shadow-md hover:-translate-y-0.5"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

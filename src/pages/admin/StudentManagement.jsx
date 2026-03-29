import { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { useShowToast } from '../../components/Layout';
import { Search, Edit2, Save, BookOpen, User, Edit3, CheckCircle, AlertTriangle } from 'lucide-react';

export default function StudentManagement() {
  const showToast = useShowToast();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/students')
      .then(res => setStudents(res.data))
      .catch(err => showToast(err.response?.data?.error || 'Failed to fetch students', 'error'));
  }, []);

  // Shared Filters
  const [search1, setSearch1] = useState('');
  const [progFilter1, setProgFilter1] = useState('');
  const [yearFilter1, setYearFilter1] = useState('');
  const [semFilter1, setSemFilter1] = useState('');

  const [search2, setSearch2] = useState('');
  const [progFilter2, setProgFilter2] = useState('');
  const [yearFilter2, setYearFilter2] = useState('');
  const [currentSemOnly, setCurrentSemOnly] = useState(false);

  // Sorting Table 1
  const [sortField, setSortField] = useState(null); // 'batchYear' | 'currentSem'
  const [sortDesc, setSortDesc]   = useState(false);

  // Profile Edit
  const [viewStudent, setViewStudent] = useState(null);
  const [profileDraft, setProfileDraft] = useState({});

  // Edit Grades
  const [editGradesRoll, setEditGradesRoll] = useState('');
  const [editGradesSem, setEditGradesSem] = useState('');
  const [editGradesData, setEditGradesData] = useState(null);
  const [showGradesConfirm, setShowGradesConfirm] = useState(false);

  // ── TABLE 1 DATA ──
  const table1Data = useMemo(() => {
    let raw = students.map(s => {
      const currentSem = (s.academicRecord && s.academicRecord.length > 0) ? s.academicRecord[s.academicRecord.length - 1].semester : 0;
      return { ...s, currentSem };
    });

    if (progFilter1) raw = raw.filter(s => s.program === progFilter1);
    if (yearFilter1) raw = raw.filter(s => s.batchYear === Number(yearFilter1));
    if (semFilter1)  raw = raw.filter(s => s.currentSem === Number(semFilter1));
    if (search1) {
      const q = search1.toLowerCase();
      raw = raw.filter(s => (s.name || '').toLowerCase().includes(q) || (s.rollNo || '').toLowerCase().includes(q));
    }

    if (sortField) {
      raw = raw.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA < valB) return sortDesc ? 1 : -1;
        if (valA > valB) return sortDesc ? -1 : 1;
        return 0;
      });
    }
    return raw;
  }, [students, search1, progFilter1, yearFilter1, semFilter1, sortField, sortDesc]);

  // ── TABLE 2 DATA (Flattened Courses) ──
  const table2Data = useMemo(() => {
    let rows = [];
    students.forEach(s => {
      if (progFilter2 && s.program !== progFilter2) return;
      if (yearFilter2 && s.batchYear !== Number(yearFilter2)) return;
      
      const currentSem = (s.academicRecord && s.academicRecord.length > 0) ? s.academicRecord[s.academicRecord.length - 1].semester : 0;

      (s.academicRecord || []).forEach(sem => {
        if (currentSemOnly && sem.semester !== currentSem) return;
        (sem.courses || []).forEach(c => {
          rows.push({
            rollNo: s.rollNo,
            studentName: s.name,
            courseCode: c.courseCode,
            courseName: c.courseName,
            semesterTaken: sem.semester,
            credits: c.credits,
            grade: c.grade || 'N/A'
          });
        });
      });
    });

    rows = rows.sort((a, b) => a.semesterTaken - b.semesterTaken);

    if (search2) {
      const q = search2.toLowerCase();
      rows = rows.filter(r => 
        (r.studentName || '').toLowerCase().includes(q) || 
        (r.rollNo || '').toLowerCase().includes(q) || 
        (r.courseCode || '').toLowerCase().includes(q)
      );
    }
    return rows;
  }, [students, search2, progFilter2, yearFilter2, currentSemOnly]);


  const programs = [...new Set(students.map(s => s.program).filter(Boolean))];
  const years = [...new Set(students.map(s => s.batchYear).filter(Boolean))].sort();

  function toggleSort(field) {
    if (sortField === field) setSortDesc(!sortDesc);
    else { setSortField(field); setSortDesc(false); }
  }

  function openEdit(student) {
    setViewStudent(student);
    setProfileDraft({ ...student });
  }

  async function saveProfile() {
    try {
      const res = await api.put(`/students/${viewStudent.rollNo}`, profileDraft);
      setStudents(prev => prev.map(s => s.rollNo === viewStudent.rollNo ? res.data : s));
      setViewStudent(null);
      showToast(`Profile updated for ${profileDraft.name}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update profile', 'error');
    }
  }

  // ── Edit Grades Flow ──
  const foundStudent = students.find(s => s.rollNo.toUpperCase() === editGradesRoll.toUpperCase().trim());

  useEffect(() => {
    if (foundStudent && editGradesSem) {
      const semRecord = foundStudent.academicRecord.find(r => r.semester === Number(editGradesSem));
      if (semRecord) {
        setEditGradesData(semRecord.courses.map(c => ({...c, newGrade: c.grade || ''})));
      } else {
        setEditGradesData([]); // No courses in that sem
      }
    } else {
      setEditGradesData(null);
    }
  }, [editGradesRoll, editGradesSem, foundStudent]);

  function handleNewGradeChange(code, val) {
    setEditGradesData(prev => prev.map(c => c.courseCode === code ? {...c, newGrade: val} : c));
  }

  async function confirmGradeChanges() {
    const payload = {
      semester: Number(editGradesSem),
      courses: editGradesData
        .filter(c => c.newGrade && c.newGrade !== c.grade)
        .map(c => ({ courseCode: c.courseCode, newGrade: c.newGrade }))
    };

    if (payload.courses.length === 0) {
      setShowGradesConfirm(false);
      return;
    }

    try {
      const res = await api.put(`/students/${foundStudent.rollNo}/grades`, payload);
      setStudents(prev => prev.map(s => s.rollNo === foundStudent.rollNo ? res.data : s));
      
      showToast('Student grades updated successfully', 'success');
      setEditGradesRoll('');
      setEditGradesSem('');
      setEditGradesData(null);
      setShowGradesConfirm(false);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update grades', 'error');
    }
  }

  function getPointsForGrade(g) {
    const m = { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 0 };
    return m[g] || 0;
  }

  return (
    <div className="flex flex-col gap-10">
      
      {/* ── Section Header ── */}
      <div>
        <h2 className="text-3xl font-extrabold text-navy">Student Management</h2>
        <p className="text-sm font-medium text-gray-500 mt-2">Manage student personal records and academic history.</p>
      </div>

      {/* ── TABLE 1: Personal Details ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-navy flex items-center gap-2">
            <User className="w-5 h-5 text-gold" /> Personal Details
          </h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{table1Data.length} records</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search1} onChange={e => setSearch1(e.target.value)}
              placeholder="Search Name or Roll No…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all font-medium" />
          </div>
          <select value={progFilter1} onChange={e => setProgFilter1(e.target.value)} className="px-4 py-2.5 text-sm border-2 border-gray-100 rounded-xl outline-none focus:border-gold font-medium bg-white">
            <option value="">All Programs</option>
            {programs.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={yearFilter1} onChange={e => setYearFilter1(e.target.value)} className="px-4 py-2.5 text-sm border-2 border-gray-100 rounded-xl outline-none focus:border-gold font-medium bg-white">
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={semFilter1} onChange={e => setSemFilter1(e.target.value)} className="px-4 py-2.5 text-sm border-2 border-gray-100 rounded-xl outline-none focus:border-gold font-medium bg-white">
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
          </select>
        </div>

        {/* Table Wrapper */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Roll No</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Full Name</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Father's Name</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Phone</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Address</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Program</th>
                  
                  <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-navy-light transition-colors" onClick={() => toggleSort('batchYear')}>
                    Year of Joining {sortField === 'batchYear' && (sortDesc ? '↓' : '↑')}
                  </th>
                  <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-navy-light transition-colors" onClick={() => toggleSort('currentSem')}>
                    Current Semester {sortField === 'currentSem' && (sortDesc ? '↓' : '↑')}
                  </th>
                  <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {table1Data.map((s, i) => (
                  <tr key={s.rollNo} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gold/5 transition-colors border-b border-gray-100`}>
                    <td className="px-5 py-4 font-bold text-gold">{s.rollNo}</td>
                    <td className="px-5 py-4 font-semibold text-navy">{s.name}</td>
                    <td className="px-5 py-4 text-gray-600">{s.fatherName}</td>
                    <td className="px-5 py-4 text-gray-600 font-medium">{s.personalPhone}</td>
                    <td className="px-5 py-4 text-gray-500 max-w-[200px] truncate" title={s.address}>{s.address}</td>
                    <td className="px-5 py-4 text-gray-700">{s.program}</td>
                    <td className="px-5 py-4 text-center font-semibold">{s.batchYear}</td>
                    <td className="px-5 py-4 text-center font-bold text-navy">{s.currentSem}</td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => openEdit(s)} className="inline-flex items-center justify-center p-2 bg-navy/10 text-navy rounded-xl hover:bg-navy hover:text-white transition-all shadow-sm">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {table1Data.length === 0 && <tr><td colSpan={9} className="text-center py-8 text-gray-400 font-medium">No records found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── TABLE 2: Course History ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-navy flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold" /> Student Course History
          </h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{table2Data.length} course entries</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search2} onChange={e => setSearch2(e.target.value)}
              placeholder="Search Student, Roll No, or Course Code…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all font-medium" />
          </div>
          <select value={progFilter2} onChange={e => setProgFilter2(e.target.value)} className="px-4 py-2.5 text-sm border-2 border-gray-100 rounded-xl outline-none focus:border-gold font-medium bg-white">
            <option value="">All Programs</option>
            {programs.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={yearFilter2} onChange={e => setYearFilter2(e.target.value)} className="px-4 py-2.5 text-sm border-2 border-gray-100 rounded-xl outline-none focus:border-gold font-medium bg-white">
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
            <input type="checkbox" checked={currentSemOnly} onChange={e => setCurrentSemOnly(e.target.checked)} className="w-4 h-4 text-navy rounded focus:ring-navy" />
            <span className="text-sm font-bold text-navy">Current Semester Only</span>
          </label>
        </div>

        {/* Table Wrapper */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden">
          <div className="max-h-[500px] overflow-auto custom-scrollbar">
            <table className="w-full text-sm whitespace-nowrap text-left border-collapse">
              <thead className="bg-navy text-white sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Roll No</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Student Name</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Semester Taken</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Course Code</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Course Name</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Credits</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {table2Data.map((row, i) => (
                  <tr key={`${row.rollNo}-${row.courseCode}`} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gold/5 transition-colors border-b border-gray-100`}>
                    <td className="px-5 py-3.5 font-bold text-gray-700">{row.rollNo}</td>
                    <td className="px-5 py-3.5 font-semibold text-navy">{row.studentName}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-gray-600 bg-gray-50">{row.semesterTaken}</td>
                    <td className="px-5 py-3.5 font-bold text-gold">{row.courseCode}</td>
                    <td className="px-5 py-3.5 text-gray-800 font-medium">{row.courseName}</td>
                    <td className="px-5 py-3.5 text-center text-gray-600">{row.credits}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm ${(row.grade || '').includes('F') ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {row.grade}
                      </span>
                    </td>
                  </tr>
                ))}
                {table2Data.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-gray-400 font-medium">No course history found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Section 3: Edit Student Grades ── */}
      <section className="bg-white rounded-2xl shadow-card border border-gray-200 p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-navy flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-gold" /> Edit Student Grades
          </h3>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Update final grades for a specific student's enrolled courses.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Step 1: Roll Number */}
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                1. Enter Roll Number
              </label>
              <input 
                type="text" 
                value={editGradesRoll}
                onChange={e => setEditGradesRoll(e.target.value)}
                placeholder="e.g. CS-2022-001"
                className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 font-medium text-navy transition-all"
              />
              <div className="mt-2 text-sm font-semibold">
                 {editGradesRoll && foundStudent ? (
                    <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Found: {foundStudent.name}</span>
                 ) : editGradesRoll ? (
                    <span className="text-red-500">Student not found</span>
                 ) : (
                    <span className="text-gray-400">Enter roll number to verify.</span>
                 )}
              </div>
            </div>

            {/* Step 2: Select Semester */}
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                2. Select Semester
              </label>
              <select 
                value={editGradesSem}
                onChange={e => setEditGradesSem(e.target.value)}
                disabled={!foundStudent}
                className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 font-medium text-navy transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">-- Choose Semester --</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Grades Table */}
        {editGradesData !== null && editGradesData.length > 0 && (
          <div className="animate-fade-in">
            <h4 className="text-sm font-bold text-navy uppercase tracking-wide mb-3">3. Update Grades</h4>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
              <table className="w-full text-sm whitespace-nowrap text-left border-collapse">
                <thead className="bg-navy/5 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold text-navy uppercase">Course Code</th>
                    <th className="px-5 py-3 text-xs font-bold text-navy uppercase">Course Name</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-navy uppercase">Current Grade</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-navy uppercase">New Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {editGradesData.map(c => (
                    <tr key={c.courseCode} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-5 py-3 font-bold text-gold">{c.courseCode}</td>
                      <td className="px-5 py-3 font-medium text-gray-800">{c.courseName}</td>
                      <td className="px-5 py-3 text-center">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-bold text-xs">{c.grade || '--'}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <select 
                          value={c.newGrade || ''} 
                          onChange={(e) => handleNewGradeChange(c.courseCode, e.target.value)}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-bold text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                        >
                          <option value="">--</option>
                          <option value="A+">A+</option>
                          <option value="A">A</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="F">F</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setShowGradesConfirm(true)}
                className="px-6 py-3 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light transition-all shadow-md focus:ring-4 focus:ring-navy/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {editGradesData !== null && editGradesData.length === 0 && (
          <div className="py-8 text-center text-gray-500 font-medium bg-gray-50 border border-gray-100 rounded-xl">
            No courses found for this student in Semester {editGradesSem}.
          </div>
        )}
      </section>

      {/* Confirmation Modal for Grade Changes */}
      <Modal 
        isOpen={showGradesConfirm} 
        onClose={() => setShowGradesConfirm(false)}
        title="Confirm Grade Changes"
        footer={
          <>
            <button onClick={() => setShowGradesConfirm(false)} className="px-5 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button onClick={confirmGradeChanges} className="px-5 py-2 text-sm font-bold text-white bg-navy hover:bg-navy-light rounded-xl shadow-md transition-all">
              Confirm &amp; Update
            </button>
          </>
        }
      >
        <div className="flex gap-4 p-2">
          <AlertTriangle className="w-8 h-8 text-orange-500 shrink-0" />
          <div>
            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-2">
              Are you sure you want to edit this student's grades? This action will update their academic record permanently.
            </p>
            <p className="text-xs text-gray-500 font-bold">
              Student: {foundStudent?.name} ({foundStudent?.rollNo})
            </p>
          </div>
        </div>
      </Modal>

      {/* Edit Personal Details Modal */}
      <Modal isOpen={!!viewStudent} onClose={() => setViewStudent(null)} title="Edit Personal Details" size="xl"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button onClick={() => setViewStudent(null)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
            <button onClick={saveProfile} className="flex items-center gap-2 px-6 py-2.5 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light focus:ring-4 focus:ring-navy/20 transition-all shadow-md">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-5 px-1 py-2">
          {[
            { label: 'Full Name', key: 'name' },
            { label: 'Father\'s Name', key: 'fatherName' },
            { label: 'Personal Phone', key: 'personalPhone' },
            { label: 'Address', key: 'address', fullWidth: true },
            { label: 'Program', key: 'program' },
            { label: 'Year of Joining', key: 'batchYear', type: 'number' },
          ].map(f => (
            <div key={f.key} className={f.fullWidth ? 'col-span-2' : ''}>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">{f.label}</label>
              <input 
                 type={f.type || 'text'} 
                 value={profileDraft[f.key] || ''}
                 onChange={e => setProfileDraft(d => ({ ...d, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 font-medium text-navy transition-all" 
              />
            </div>
          ))}
        </div>
      </Modal>

    </div>
  );
}

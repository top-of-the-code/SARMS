import { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { departments } from '../../data/departments';
import { currentSemester } from '../../data/config';
import Modal from '../../components/Modal';
import { useShowToast } from '../../components/Layout';
import { Plus, Edit2, Power, Search, Filter } from 'lucide-react';

const STATUS_BADGE = {
  'Active': 'bg-emerald-100 text-emerald-700',
  'Inactive': 'bg-gray-100 text-gray-500',
  'Pending': 'bg-amber-100 text-amber-700'
};



const EMPTY_FORM = { 
  codeNum: '', 
  name: '', 
  credits: 4, 
  semesterType: currentSemester.type, 
  year: currentSemester.year,
  facultyId: 'FAC-001', 
  type: 'core',
  departmentCode: 'CSC',
  department: 'Computer Science'
};

export default function CourseOversight() {
  const showToast = useShowToast();
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  
  useEffect(() => {
    Promise.all([api.get('/courses'), api.get('/faculty')])
      .then(([courseRes, facRes]) => {
        setCourses(courseRes.data);
        setFacultyList(facRes.data);
      })
      .catch(err => showToast(err.response?.data?.error || 'Failed to load data', 'error'));
  }, []);
  
  // Filters
  const [search, setSearch]   = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Sort
  const [sortDesc, setSortDesc] = useState(true);

  // Modal State
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit'
  const [formData, setFormData]   = useState(EMPTY_FORM);
  const [editCode, setEditCode]   = useState(null);
  
  const [confirmToggle, setConfirmToggle] = useState(null);

  // Processing Data
  const filteredData = useMemo(() => {
    let raw = courses.slice();
    if (search) {
      const q = search.toLowerCase();
      raw = raw.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || (c.facultyName && c.facultyName.toLowerCase().includes(q)));
    }
    if (yearFilter) {
      raw = raw.filter(c => c.year === Number(yearFilter));
    }
    if (typeFilter) {
      raw = raw.filter(c => c.semesterType === typeFilter);
    }
    // Sort by descending year, then semester type
    raw.sort((a,b) => {
      if (a.year !== b.year) {
         return sortDesc ? (b.year || 0) - (a.year || 0) : (a.year || 0) - (b.year || 0);
      }
      return sortDesc ? (b.semesterType || '').localeCompare(a.semesterType || '') : (a.semesterType || '').localeCompare(b.semesterType || '');
    });
    return raw;
  }, [courses, search, yearFilter, typeFilter, sortDesc]);


  function openCreate() { 
    setFormData(EMPTY_FORM); 
    setModalMode('create'); 
  }

  function openEdit(course) {
    setEditCode(course.code);
    const codeMatch = course.code.match(/^([A-Z]{3})(\d{3})$/);
    const numPart = codeMatch ? codeMatch[2] : course.code.replace(/[^0-9]/g, '');
    
    setFormData({ 
      codeNum: numPart,
      name: course.name,
      credits: course.credits,
      semesterType: course.semesterType || currentSemester.type,
      year: course.year || currentSemester.year,
      facultyId: course.facultyId || '',
      type: course.category || course.type || 'core',
      departmentCode: course.departmentCode || 'CSC',
      department: course.department || 'Computer Science'
    });
    setModalMode('edit');
  }

  async function handleSave() {
    const faculty = facultyList.find(f => f.id === formData.facultyId);
    const finalCode = `${formData.departmentCode}${formData.codeNum}`;
    
    if (modalMode === 'create') {
      const newCourse = { 
        ...formData, 
        code: finalCode,
        category: formData.type,
        facultyName: faculty?.name || 'Unassigned', 
        status: 'Pending'
      };
      
      try {
        const res = await api.post('/courses', newCourse);
        setCourses(prev => [res.data, ...prev]);
        showToast(`Course ${finalCode} created.`, 'success');
        setModalMode(null);
      } catch (err) {
        showToast(err.response?.data?.error || 'Failed to create course', 'error');
      }
    } else {
      const updates = { 
        ...formData, 
        code: finalCode, 
        category: formData.type, 
        facultyName: faculty?.name || formData.facultyName 
      };
      
      try {
        const res = await api.put(`/courses/${editCode}`, updates);
        setCourses(prev => prev.map(c => c.code === editCode ? res.data : c));
        showToast(`Course ${finalCode} updated.`, 'success');
        setModalMode(null);
      } catch (err) {
        showToast(err.response?.data?.error || 'Failed to update course', 'error');
      }
    }
  }

  async function toggleStatus(code) {
    try {
      const res = await api.put(`/courses/${code}/status`);
      setCourses(prev => prev.map(c => c.code === code ? res.data : c));
      setConfirmToggle(null);
      showToast(`Status updated successfully.`, 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update status', 'error');
      setConfirmToggle(null);
    }
  }

  function handleField(key, val) { 
    if (key === 'departmentCode') {
       const dept = departments.find(d => d.code === val);
       setFormData(d => ({ ...d, departmentCode: val, department: dept?.name || 'Unknown' }));
       return;
    }
    setFormData(d => ({ ...d, [key]: val })); 
  }

  const years = [...new Set(courses.map(c => c.year).filter(Boolean))].sort((a,b)=>b-a);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-navy">Course Management</h2>
          <p className="text-sm font-medium text-gray-500 mt-2">Manage all university courses, assignments, and statuses.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-6 py-3 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light transition-all shadow-md hover:-translate-y-0.5 focus:ring-4 focus:ring-navy/20">
          <Plus className="w-5 h-5" /> Create New Course
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search Course Code, Name, or Faculty…"
            className="w-full pl-11 pr-4 py-2.5 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all font-medium"
          />
        </div>
        <div className="relative">
          <select
            value={yearFilter} onChange={e => setYearFilter(e.target.value)}
            className="appearance-none px-5 py-2.5 pr-10 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all font-bold text-navy bg-white min-w-[140px] cursor-pointer"
          >
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="appearance-none px-5 py-2.5 pr-10 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all font-bold text-navy bg-white min-w-[170px] cursor-pointer"
          >
            <option value="">All Sem Types</option>
            <option value="Spring">Spring</option>
            <option value="Monsoon">Monsoon</option>
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap text-left border-collapse">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Course Code</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Course Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Department</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Credits</th>
                <th 
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center cursor-pointer hover:bg-navy-light transition-colors"
                  onClick={() => setSortDesc(!sortDesc)}
                  title="Sort by Year/Sem"
                >
                  Year {sortDesc ? '↓' : '↑'}
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Term</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Assigned Faculty</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((c, i) => (
                <tr key={c.code} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gold/5 transition-colors border-b border-gray-100`}>
                  <td className="px-6 py-4 font-bold text-gold">{c.code}</td>
                  <td className="px-6 py-4 font-bold text-navy max-w-[200px] truncate" title={c.name}>{c.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[10px] whitespace-nowrap font-bold text-gray-700 bg-gray-100/80 px-2.5 py-1 rounded-md border border-gray-200">
                      {c.department} · {c.departmentCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-600">{c.credits}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-800 bg-gray-50">{c.year}</td>
                  <td className="px-6 py-4 text-center font-medium text-navy">{c.semesterType}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{c.facultyName}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm ${c.category === 'core' ? 'bg-navy focus:bg-navy/80 text-white' : 'bg-blue-100 text-blue-700'}`}>
                      {c.category?.replace(/([A-Z])/g, ' $1') || c.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm ${STATUS_BADGE[c.status] || 'bg-gray-100 text-gray-600'}`}>
                       {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                       <button onClick={() => openEdit(c)} className="p-2 bg-navy/10 text-navy rounded-xl hover:bg-navy hover:text-white transition-all shadow-sm" title="Edit">
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => setConfirmToggle(c.code)} className={`p-2 rounded-xl transition-all shadow-sm ${c.status === 'Active' ? 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'}`} title={c.status === 'Active' ? 'Deactivate' : 'Activate'}>
                         <Power className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400 font-medium">No courses found matching the criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit Course */}
      <Modal
        isOpen={!!modalMode}
        onClose={() => setModalMode(null)}
        title={modalMode === 'create' ? 'Create New Course' : `Edit Course`}
        size="lg"
        footer={
          <div className="w-full flex justify-end gap-3">
             <button onClick={() => setModalMode(null)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
             <button onClick={handleSave} className="px-6 py-2.5 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light focus:ring-4 focus:ring-navy/20 transition-all shadow-md">
               Save Changes
             </button>
          </div>
        }
      >
        <div className="space-y-5 px-1 py-1">
          {modalMode === 'create' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-amber-800 font-medium">
                <strong>Note:</strong> Once created, the assigned faculty member will be prompted to complete the course syllabus and description. The status will default to "Pending".
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-5">
             <div className="col-span-2 md:col-span-1 flex gap-2">
               <div className="flex-1">
                 <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Department</label>
                 <select value={formData.departmentCode} onChange={e => handleField('departmentCode', e.target.value)}
                   className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-bold text-navy bg-white">
                   {departments.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                 </select>
               </div>
               <div className="w-24">
                 <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Code</label>
                 <input type="text" value={formData.departmentCode} disabled className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 bg-gray-50 text-gray-500 rounded-xl font-bold cursor-not-allowed text-center" />
               </div>
             </div>
             
             <div className="col-span-2 md:col-span-1">
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">3-Digit Course Num</label>
               <input
                 type="text" placeholder="e.g. 101" disabled={modalMode === 'edit'}
                 value={formData.codeNum} onChange={e => handleField('codeNum', e.target.value)}
                 className={`w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-bold text-navy transition-all ${modalMode === 'edit' ? 'bg-gray-100 opacity-70 cursor-not-allowed' : ''}`}
               />
               <p className="text-[10px] font-bold text-navy/50 mt-1 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded inline-block border border-gray-100">Live Preview: {formData.departmentCode}{formData.codeNum || '___'}</p>
             </div>
             
             <div className="col-span-2 md:col-span-1">
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Course Name</label>
               <input
                 type="text" placeholder="Full Course Name" 
                 value={formData.name} onChange={e => handleField('name', e.target.value)}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-medium text-navy transition-all"
               />
             </div>
             
             <div>
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Credits</label>
               <input type="number" min={1} max={6} value={formData.credits} onChange={e => handleField('credits', Number(e.target.value))}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-medium text-navy transition-all text-center" />
             </div>
             
             <div>
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Year</label>
               <input type="number" min={2020} max={2030} value={formData.year} onChange={e => handleField('year', Number(e.target.value))}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-bold text-navy transition-all text-center" />
             </div>
             
             <div className="col-span-2 md:col-span-1">
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Semester Type</label>
               <select value={formData.semesterType} onChange={e => handleField('semesterType', e.target.value)}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-bold text-navy bg-white">
                 <option value="Spring">Spring</option>
                 <option value="Monsoon">Monsoon</option>
                 <option value="Autumn">Autumn</option>
               </select>
             </div>
             
             <div className="col-span-2 md:col-span-1">
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Category</label>
               <select value={formData.type} onChange={e => handleField('type', e.target.value)}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-bold text-navy bg-white">
                 <option value="core">Core Courses</option>
                 <option value="majorElective">Major Elective</option>
                 <option value="uwe">University Wide Elective (UWE)</option>
                 <option value="ccc">Core Common Curriculum (CCC)</option>
               </select>
             </div>
             
             <div className="col-span-2 md:col-span-1">
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Assign Faculty</label>
                 <select value={formData.facultyId} onChange={e => handleField('facultyId', e.target.value)}
                   className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-bold text-navy bg-white">
                   <option value="">-- Unassigned --</option>
                   {facultyList.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                 </select>
             </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={!!confirmToggle} onClose={() => setConfirmToggle(null)} title="Confirm Action" size="sm"
        footer={
          <div className="flex w-full gap-3">
             <button onClick={() => setConfirmToggle(null)} className="flex-1 px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
             <button onClick={() => toggleStatus(confirmToggle)} className="flex-1 px-4 py-2 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light transition-all shadow-md">Confirm</button>
          </div>
        }
      >
        <p className="text-sm font-medium text-gray-700">Are you sure you want to change the status of this course?</p>
      </Modal>
    </div>
  );
}

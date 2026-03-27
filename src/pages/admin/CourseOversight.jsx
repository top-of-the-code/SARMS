import { useState, useMemo } from 'react';
import { COURSES } from '../../data/courses';
import { FACULTY } from '../../data/faculty';
import Modal from '../../components/Modal';
import { useShowToast } from '../../components/Layout';
import { Plus, Edit2, Power, Search, Filter } from 'lucide-react';

const STATUS_BADGE = {
  'Active': 'bg-emerald-100 text-emerald-700',
  'Inactive': 'bg-gray-100 text-gray-500',
  'Pending — awaiting faculty details': 'bg-amber-100 text-amber-700'
};

const initialCourses = COURSES.map(c => ({ ...c }));

const EMPTY_FORM = { 
  code: '', 
  name: '', 
  credits: 4, 
  semester: 4, 
  facultyId: 'FAC-001', 
  type: 'Compulsory' 
};

export default function CourseOversight() {
  const showToast = useShowToast();
  const [courses, setCourses] = useState(initialCourses);
  
  // Filters
  const [search, setSearch]   = useState('');
  const [semFilter, setSemFilter] = useState('');
  
  // Sort
  const [sortDesc, setSortDesc] = useState(false);

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
      raw = raw.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.facultyName?.toLowerCase().includes(q));
    }
    if (semFilter) {
      raw = raw.filter(c => c.semester === Number(semFilter));
    }
    // Sort by semester
    raw.sort((a,b) => sortDesc ? b.semester - a.semester : a.semester - b.semester);
    return raw;
  }, [courses, search, semFilter, sortDesc]);


  function openCreate() { 
    setFormData(EMPTY_FORM); 
    setModalMode('create'); 
  }

  function openEdit(course) {
    setEditCode(course.code);
    setFormData({ 
      code: course.code,
      name: course.name,
      credits: course.credits,
      semester: course.semester,
      facultyId: course.facultyId || '',
      type: course.type
    });
    setModalMode('edit');
  }

  function handleSave() {
    const faculty = FACULTY.find(f => f.id === formData.facultyId);
    
    if (modalMode === 'create') {
      const newCourse = { 
        ...formData, 
        facultyName: faculty?.name || 'Unassigned', 
        enrolled: 0,
        status: 'Pending — awaiting faculty details'
      };
      setCourses(prev => [newCourse, ...prev]);
      showToast(`Course ${formData.code} created.`, 'success');
    } else {
      setCourses(prev => prev.map(c => c.code === editCode ? { ...c, ...formData, facultyName: faculty?.name || c.facultyName } : c));
      showToast(`Course ${formData.code} updated.`, 'success');
    }
    setModalMode(null);
  }

  function toggleStatus(code) {
    setCourses(prev => prev.map(c => {
      if (c.code !== code) return c;
      return { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' };
    }));
    setConfirmToggle(null);
    showToast(`Status updated successfully.`, 'success');
  }

  function handleField(key, val) { 
    setFormData(d => ({ ...d, [key]: val })); 
  }

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
            value={semFilter} onChange={e => setSemFilter(e.target.value)}
            className="appearance-none px-5 py-2.5 pr-10 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all font-bold text-navy bg-white min-w-[180px] cursor-pointer"
          >
            <option value="">Filter by Semester...</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Credits</th>
                <th 
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center cursor-pointer hover:bg-navy-light transition-colors"
                  onClick={() => setSortDesc(!sortDesc)}
                  title="Sort by Semester"
                >
                  Semester {sortDesc ? '↓' : '↑'}
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Assigned Faculty</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Enrolled</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((c, i) => (
                <tr key={c.code} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gold/5 transition-colors border-b border-gray-100`}>
                  <td className="px-6 py-4 font-bold text-gold">{c.code}</td>
                  <td className="px-6 py-4 font-bold text-navy max-w-[200px] truncate" title={c.name}>{c.name}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-600">{c.credits}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-800 bg-gray-50">{c.semester}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{c.facultyName}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-600">{c.enrolled}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm ${c.type === 'Compulsory' ? 'bg-navy focus:bg-navy/80 text-white' : 'bg-blue-100 text-blue-700'}`}>
                      {c.type}
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
             <div className="col-span-2 md:col-span-1">
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Course Code</label>
               <input
                 type="text" placeholder="e.g. CS101" disabled={modalMode === 'edit'}
                 value={formData.code} onChange={e => handleField('code', e.target.value)}
                 className={`w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-bold text-navy transition-all ${modalMode === 'edit' ? 'bg-gray-100 opacity-70' : ''}`}
               />
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
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Semester</label>
               <select value={formData.semester} onChange={e => handleField('semester', Number(e.target.value))}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-bold text-navy bg-white">
                 {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
               </select>
             </div>
             
             <div className="col-span-2 md:col-span-1">
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Type</label>
               <select value={formData.type} onChange={e => handleField('type', e.target.value)}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-bold text-navy bg-white">
                 <option>Compulsory</option>
                 <option>Elective</option>
               </select>
             </div>
             
             <div className="col-span-2 md:col-span-1">
               <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Assign Faculty</label>
               <select value={formData.facultyId} onChange={e => handleField('facultyId', e.target.value)}
                 className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold font-bold text-navy bg-white">
                 {FACULTY.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
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

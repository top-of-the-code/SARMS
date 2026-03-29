import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { useShowToast } from '../../components/Layout';
import { Upload, AlertTriangle, Layers } from 'lucide-react';
import { currentSemester } from '../../data/config';

const YEAR_GROUPS = [
  { label: 'First Year', value: 'First Year', semesters: [1, 2] },
  { label: 'Second Year', value: 'Second Year', semesters: [3, 4] },
  { label: 'Third Year', value: 'Third Year', semesters: [5, 6] },
  { label: 'Fourth Year', value: 'Fourth Year', semesters: [7, 8] },
];

export default function UploadResults() {
  const showToast = useShowToast();
  
  // Local snapshot to simulate data persistence
  const [localCourses, setLocalCourses] = useState([]);
  
  useEffect(() => {
    api.get('/courses')
      .then(res => setLocalCourses(res.data))
      .catch(err => showToast(err.response?.data?.error || 'Failed to fetch courses', 'error'));
  }, []);
  
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Derive how many courses apply to the selected group
  const activeGroup = YEAR_GROUPS.find(g => g.value === selectedGroup);
  
  const relevantCourses = activeGroup 
    ? localCourses.filter(c => activeGroup.semesters.includes(c.semester))
    : [];
    
  // Check how many are unpublished
  const unpublishedCount = relevantCourses.filter(c => !c.resultsPublished).length;

  async function handlePublish() {
    if (!activeGroup) return;

    try {
      await api.put('/courses/publish', { semesters: activeGroup.semesters });
      
      setLocalCourses(prev => prev.map(c => {
        if (activeGroup.semesters.includes(c.semester)) {
          return { ...c, resultsPublished: true };
        }
        return c;
      }));
      
      setShowConfirm(false);
      showToast(`Results published successfully for ${activeGroup.value}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to publish results', 'error');
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-extrabold text-navy">Upload Results</h2>
        <p className="text-sm font-medium text-gray-500 mt-2">Bulk publish finalized end-of-semester grades by academic year group.</p>
      </div>

      <section className="bg-white rounded-3xl shadow-card border border-gray-200 p-8 md:p-12 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-navy/5 text-navy rounded-2xl flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-navy">Bulk Publishing Engine</h3>
            <p className="text-sm font-medium text-gray-500">Select an entire cohort to finalize their result data.</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-bold text-navy bg-blue-50/50 px-5 py-4 border border-blue-100 rounded-xl mb-6 shadow-sm">
            You are publishing results for the current semester: {currentSemester.type}, {currentSemester.year}
          </p>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
            Select Year Group
          </label>
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="w-full px-5 py-4 text-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 font-bold text-navy transition-all bg-white"
          >
            <option value="">-- Choose a Cohort --</option>
            {YEAR_GROUPS.map(g => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        
        {activeGroup && (
          <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-1">Impact Analysis</p>
              <p className="text-sm font-medium text-navy">
                This action will publish results for <strong>{relevantCourses.length} courses</strong>.<br/>
                <span className={unpublishedCount === 0 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                  {unpublishedCount === 0 ? "All courses already published." : `${unpublishedCount} courses awaiting publication.`}
                </span>
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowConfirm(true)}
          disabled={!selectedGroup || unpublishedCount === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-navy text-white text-sm font-extrabold rounded-xl hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md focus:ring-4 focus:ring-navy/20"
        >
          <Upload className="w-5 h-5" />
          Publish Results
        </button>
      </section>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={showConfirm} 
        onClose={() => setShowConfirm(false)}
        title="Confirm Bulk Publishing"
      >
        <div className="p-2 mb-6 flex gap-5">
          <AlertTriangle className="w-10 h-10 text-amber-500 shrink-0" />
          <div>
            <p className="text-sm font-extrabold text-navy mb-2">
              Are you sure you want to publish results for all {activeGroup?.value} students?
            </p>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Once published, faculty will no longer be able to edit or make changes to any grades for these courses. Students will immediately have access to their final marks.
            </p>
          </div>
        </div>
        <div className="flex w-full gap-3 justify-end pt-5 border-t border-gray-100">
           <button onClick={() => setShowConfirm(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
             Cancel
           </button>
           <button onClick={handlePublish} className="px-6 py-2.5 bg-navy text-white text-sm font-extrabold rounded-xl hover:bg-navy-light transition-all shadow-md focus:ring-4 focus:ring-navy/20">
             Yes, Publish Results
           </button>
        </div>
      </Modal>

    </div>
  );
}

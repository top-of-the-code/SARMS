import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useShowToast } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useTermConfig } from '../../context/TermConfigContext';
import { Calendar, AlertTriangle } from 'lucide-react';

const YEAR_OPTIONS = Array.from({ length: 14 }, (_, i) => 2020 + i);

export default function TermControl() {
  const showToast = useShowToast();
  const { currentUser } = useAuth();
  const { termConfig, mergeTermFromServer } = useTermConfig();

  const activeSemInfo = termConfig || { type: 'Spring', year: 2026, number: 1 };

  const [draftTermType, setDraftTermType] = useState('Spring');
  const [draftYear, setDraftYear] = useState(2026);
  const [termSubmitting, setTermSubmitting] = useState(false);
  
  const [wipeConfirmation, setWipeConfirmation] = useState('');
  const [wipeSubmitting, setWipeSubmitting] = useState(false);

  useEffect(() => {
    if (termConfig) {
      setDraftTermType(termConfig.type === 'Monsoon' ? 'Monsoon' : 'Spring');
      setDraftYear(Number(termConfig.year) || 2026);
    }
  }, [termConfig]);

  async function applyActiveTerm() {
    setTermSubmitting(true);
    try {
      const res = await api.post('/admin/term', { term: draftTermType, year: Number(draftYear) });
      if (res.data?.currentSemester) {
        mergeTermFromServer(res.data.currentSemester);
      }
      showToast(`Active term set to ${draftTermType} ${draftYear}.`, 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update active term', 'error');
    } finally {
      setTermSubmitting(false);
    }
  }

  async function runWipeAllData() {
    if (wipeConfirmation !== 'WIPE') {
      showToast('You must type WIPE to confirm.', 'error');
      return;
    }
    setWipeSubmitting(true);
    try {
      // Calls the full reset endpoint
      const res = await api.post('/admin/full-reset');
      showToast(
        `${res.data?.studentsDeleted || 0} student accounts deleted. All registrations and marks cleared. Faculty and course data preserved.`,
        'success'
      );
      setWipeConfirmation('');
    } catch (err) {
      showToast(err.response?.data?.error || 'Wipe failed', 'error');
    } finally {
      setWipeSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-navy">Term Control</h2>
        <p className="text-sm font-medium text-gray-500 mt-2 mb-3">System-wide term configurations and structural data resets.</p>
      </div>

      <section className="mb-8 rounded-2xl border-2 border-navy/15 bg-gradient-to-br from-white to-gray-50/80 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200/80 bg-navy/[0.03] px-6 py-4 flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-navy">Active Academic Term</h3>
            <p className="text-xs font-medium text-gray-500">Set the active academic term for course visibility and registration.</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-inner">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">Currently active</p>
            <p className="text-xl font-extrabold text-navy">
              {activeSemInfo.type} {activeSemInfo.year}
              <span className="text-sm font-bold text-gray-500 ml-2">(semester {activeSemInfo.number ?? '—'} · {activeSemInfo.type === 'Spring' ? 'even' : 'odd'} catalog semesters)</span>
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Term</label>
              <select
                value={draftTermType}
                onChange={e => setDraftTermType(e.target.value)}
                className="min-w-[160px] px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl font-bold text-navy bg-white focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20"
              >
                <option value="Monsoon">Monsoon</option>
                <option value="Spring">Spring</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Year</label>
              <select
                value={draftYear}
                onChange={e => setDraftYear(Number(e.target.value))}
                className="min-w-[120px] px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl font-bold text-navy bg-white focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20"
              >
                {YEAR_OPTIONS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={applyActiveTerm}
              disabled={termSubmitting}
              className="px-6 py-2.5 bg-navy text-white text-sm font-extrabold rounded-xl hover:bg-navy-light shadow-md focus:ring-4 focus:ring-navy/20 transition-all disabled:opacity-50"
            >
              {termSubmitting ? 'Saving...' : 'Set Active Term'}
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="mb-8 rounded-2xl border-2 border-red-200 bg-red-50/30 shadow-sm overflow-hidden">
        <div className="border-b border-red-200 bg-red-100/50 px-6 py-4 flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-sm border border-red-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-red-700">Danger Zone: Wipe All Student Data</h3>
            <p className="text-xs font-bold text-red-600/80">This action is irreversible and permanently destroys user records.</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-red-100">
             <ul className="list-disc pl-5 text-sm font-medium text-gray-700 space-y-1">
               <li>Deletes ALL student accounts spanning across all terms.</li>
               <li>Deletes ALL course registrations.</li>
               <li>Deletes ALL historical marks data globally.</li>
               <li>Resets system active term index (monsoon index 1).</li>
               <li className="text-emerald-700 font-bold">Safely preserves course catalogs, grading setups, faculty, and administrator accounts.</li>
             </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-4">
            <div className="flex-1 max-w-sm">
               <label className="block text-xs font-bold uppercase tracking-wide text-red-600 mb-2">Type "WIPE" to confirm</label>
               <input
                 type="text"
                 value={wipeConfirmation}
                 onChange={e => setWipeConfirmation(e.target.value)}
                 className="w-full px-4 py-2 text-sm border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 font-bold text-red-700"
                 placeholder="WIPE"
               />
            </div>
            
            <button
              onClick={runWipeAllData}
              disabled={wipeConfirmation !== 'WIPE' || wipeSubmitting}
              className="mt-6 sm:mt-0 px-6 py-2.5 bg-red-600 text-white text-sm font-extrabold rounded-xl hover:bg-red-700 shadow-md focus:ring-4 focus:ring-red-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {wipeSubmitting ? 'Wiping...' : 'Wipe All Student Data'}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

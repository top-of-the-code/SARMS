import { useState } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { useShowToast } from '../../components/Layout';
import { Upload, Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useTermConfig } from '../../context/TermConfigContext';

export default function UploadResults() {
  const showToast = useShowToast();
  const { refreshTerm } = useTermConfig();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  async function handleUpload() {
    if (!userId.trim() || !password.trim()) {
      setAuthError('Both fields are required.');
      return;
    }

    setAuthError('');
    setProcessing(true);

    try {
      const res = await api.post('/admin/upload-results', { userId: userId.trim(), password });

      setResult(res.data);
      setShowAuthModal(false);
      setUserId('');
      setPassword('');

      // Refresh the global active term config context so subsequent pages receive updated sem type/year instantly.
      if (typeof refreshTerm === 'function') {
        refreshTerm();
      }

      if (res.data.failures && res.data.failures.length > 0) {
        showToast(`Results uploaded but enrollment failed for: ${res.data.failures.join(', ')}`, 'warning');
      } else {
        showToast('Results uploaded successfully. All students have been promoted.', 'success');
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Operation failed';
      if (err.response?.status === 401) {
        setAuthError(errMsg);
      } else {
        setAuthError(errMsg);
      }
    } finally {
      setProcessing(false);
    }
  }

  function openModal() {
    setUserId('');
    setPassword('');
    setAuthError('');
    setResult(null);
    setShowAuthModal(true);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-extrabold text-navy">Upload Results</h2>
        <p className="text-sm font-medium text-gray-500 mt-2">
          Finalize grades, promote all active students to their next semester, and auto-enroll them in core courses.
        </p>
      </div>

      <section className="bg-white rounded-3xl shadow-card border border-gray-200 p-8 md:p-12 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-navy to-navy-light text-gold rounded-2xl flex items-center justify-center shadow-md">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-navy">Bulk Result Engine</h3>
            <p className="text-sm font-medium text-gray-500">One-click result finalization and semester promotion for all students.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900 mb-1">Irreversible Action</p>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                This will finalize grades for all currently enrolled students, lock their current semester courses,
                promote them to the next semester, and auto-enroll them in core courses. Students in semester 8 will be graduated.
                You will be required to re-authenticate before proceeding.
              </p>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 animate-fade-in">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-900 mb-1">Results Uploaded Successfully</p>
                <p className="text-xs text-emerald-700 font-medium">
                  {result.promoted} student{result.promoted !== 1 ? 's' : ''} promoted · {result.graduated} graduated · {result.totalProcessed} total processed
                </p>
                {result.failures && result.failures.length > 0 && (
                  <p className="text-xs text-red-600 font-bold mt-2">
                    ⚠ Enrollment failed for: {result.failures.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={openModal}
          disabled={processing}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-navy text-white text-base font-extrabold rounded-2xl hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-navy/20"
        >
          {processing ? (
            <><Loader2 className="w-6 h-6 animate-spin" /> Processing Results...</>
          ) : (
            <><Upload className="w-6 h-6" /> Upload Results for All Students</>
          )}
        </button>
      </section>

      {/* Double Authentication Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => !processing && setShowAuthModal(false)}
        title="Security Re-Authentication"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-navy/5 p-4 rounded-xl border border-navy/10">
            <Shield className="w-8 h-8 text-navy shrink-0" />
            <p className="text-sm font-medium text-gray-700">
              Please re-enter your admin credentials to authorize this critical operation.
            </p>
          </div>

          {authError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p className="text-sm font-bold">{authError}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Admin User ID</label>
            <input
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="e.g. ADM-001"
              disabled={processing}
              className="w-full px-4 py-3 text-sm font-medium border-2 border-gray-200 bg-gray-50 text-navy rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={processing}
              onKeyDown={e => e.key === 'Enter' && handleUpload()}
              className="w-full px-4 py-3 text-sm font-medium border-2 border-gray-200 bg-gray-50 text-navy rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex w-full gap-3 pt-6 mt-6 border-t border-gray-100">
          <button
            onClick={() => setShowAuthModal(false)}
            disabled={processing}
            className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={processing}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-navy text-white text-sm font-extrabold rounded-xl hover:bg-navy-light transition-all shadow-md focus:ring-4 focus:ring-navy/20 disabled:opacity-50"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying &amp; Processing...</>
            ) : (
              <><Shield className="w-4 h-4" /> Authenticate &amp; Upload</>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}

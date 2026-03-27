import { useState } from 'react';
import { useShowToast } from '../../components/Layout';
import { CheckCircle, Copy, UserPlus, FileText } from 'lucide-react';

let yearCounters = {};

function generateRollNo(year) {
  yearCounters[year] = (yearCounters[year] || 40) + 1;
  return `CS-${year}-${String(yearCounters[year]).padStart(3, '0')}`;
}

const EMPTY_FORM = {
  fullName: '', fatherName: '', motherName: '', guardianPhone: '',
  personalPhone: '', address: '', dob: '', program: 'B.Tech Computer Science', batchYear: new Date().getFullYear(),
};

const PROGRAMS = [
  'B.Tech CSE',
  'B.Tech IT',
  'MCA'
];

export default function StudentRegistration() {
  const showToast = useShowToast();
  const [form, setForm]       = useState(EMPTY_FORM);
  const [errors, setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [rollNo, setRollNo]  = useState('');
  const [copied, setCopied]   = useState(false);

  function handleChange(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.fullName.trim())       errs.fullName = 'Required';
    if (!form.fatherName.trim())     errs.fatherName = 'Required';
    if (!form.motherName.trim())     errs.motherName = 'Required';
    if (!form.guardianPhone.trim())  errs.guardianPhone = 'Required';
    if (!form.personalPhone.trim())  errs.personalPhone = 'Required';
    if (!form.address.trim())        errs.address = 'Required';
    if (!form.dob)                   errs.dob = 'Required';
    if (!form.batchYear)             errs.batchYear = 'Required';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const generated = generateRollNo(form.batchYear);
    setRollNo(generated);
    setSubmitted(true);
    showToast(`Registration Successful`, 'success');
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setSubmitted(false);
    setRollNo('');
    setCopied(false);
    setErrors({});
  }

  function copyRoll() {
    navigator.clipboard.writeText(rollNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-card border border-emerald-100 p-10 max-w-lg w-full text-center relative overflow-hidden">
           {/* Decorator blob */}
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-2xl pointer-events-none"></div>

           <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white z-10 relative">
             <CheckCircle className="w-10 h-10 text-emerald-600" />
           </div>
           
           <h2 className="text-3xl font-extrabold text-navy mb-2 z-10 relative">Registration Successful</h2>
           <p className="text-gray-500 font-medium mb-8 z-10 relative">The student {form.fullName} has been fully registered.</p>

           <div className="bg-navy rounded-2xl p-8 mb-8 shadow-md relative overflow-hidden z-10">
              <div className="absolute right-0 top-0 w-32 h-full bg-gold/10 skew-x-12 transform origin-top-left pointer-events-none"></div>
              <p className="text-xs text-gold font-bold uppercase tracking-widest mb-2 relative z-10">Assigned Roll Number</p>
              <p className="text-5xl font-extrabold text-white mb-6 relative z-10">{rollNo}</p>
              
              <button
                onClick={copyRoll}
                className="mx-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-sm font-bold transition-all w-full sm:w-auto relative z-10"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold" />}
                {copied ? 'Copied to Clipboard' : 'Copy Roll Number'}
              </button>
           </div>

           <button
             onClick={handleReset}
             className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-navy text-sm font-extrabold rounded-xl transition-all shadow-sm z-10 relative"
           >
             <UserPlus className="w-5 h-5" /> Register Another Student
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl max-w-5xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-navy rounded-2xl shadow-sm text-gold">
           <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-navy">Student Registration</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Complete the two-column form below to seamlessly register a new student.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            <div className="col-span-1 md:col-span-2 mb-2 border-b border-gray-100 pb-2">
               <h3 className="text-lg font-extrabold text-navy">Personal Details</h3>
            </div>

            <FormField label="Full Name" error={errors.fullName}>
              <input type="text" placeholder="e.g. John Doe" value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} className={inputCls(errors.fullName)} />
            </FormField>

            <FormField label="Date of Birth" error={errors.dob}>
              <input type="date" value={form.dob} onChange={e => handleChange('dob', e.target.value)} className={inputCls(errors.dob)} />
            </FormField>

            <FormField label="Father's Name" error={errors.fatherName}>
              <input type="text" placeholder="Father's full name" value={form.fatherName} onChange={e => handleChange('fatherName', e.target.value)} className={inputCls(errors.fatherName)} />
            </FormField>

            <FormField label="Mother's Name" error={errors.motherName}>
              <input type="text" placeholder="Mother's full name" value={form.motherName} onChange={e => handleChange('motherName', e.target.value)} className={inputCls(errors.motherName)} />
            </FormField>

            <FormField label="Personal Phone" error={errors.personalPhone}>
              <input type="tel" placeholder="+91 87654 32100" value={form.personalPhone} onChange={e => handleChange('personalPhone', e.target.value)} className={inputCls(errors.personalPhone)} />
            </FormField>

            <FormField label="Guardian's Phone" error={errors.guardianPhone}>
              <input type="tel" placeholder="+91 98765 43210" value={form.guardianPhone} onChange={e => handleChange('guardianPhone', e.target.value)} className={inputCls(errors.guardianPhone)} />
            </FormField>

            <FormField label="Residential Address" error={errors.address} fullWidth>
              <textarea rows={3} placeholder="Full address" value={form.address} onChange={e => handleChange('address', e.target.value)} className={`${inputCls(errors.address)} resize-none`} />
            </FormField>

            <div className="col-span-1 md:col-span-2 mt-4 mb-2 border-b border-gray-100 pb-2">
               <h3 className="text-lg font-extrabold text-navy">Academic Enrollment</h3>
            </div>

            <FormField label="Program Enrolled">
              <select value={form.program} onChange={e => handleChange('program', e.target.value)} className={inputCls()}>
                {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>

            <FormField label="Batch Year" error={errors.batchYear}>
              <input type="number" min={2020} max={2030} value={form.batchYear} onChange={e => handleChange('batchYear', e.target.value)} className={inputCls(errors.batchYear)} />
            </FormField>
          </div>

          <div className="pt-8 border-t border-gray-100 flex items-center justify-end gap-4">
            <button type="button" onClick={handleReset} className="px-6 py-3 text-sm font-bold text-gray-500 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:text-navy transition-all">
              Clear Options
            </button>
            <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light focus:ring-4 focus:ring-navy/20 transition-all shadow-md hover:-translate-y-0.5">
              <CheckCircle className="w-5 h-5" /> Confirm Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, error, children, fullWidth }) {
  return (
    <div className={fullWidth ? 'col-span-1 md:col-span-2' : ''}>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
      {children}
      {error && <p className="text-[10px] font-bold text-red-500 mt-1.5 ml-1">{error}</p>}
    </div>
  );
}

function inputCls(error) {
  return `w-full px-4 py-3 text-sm font-medium border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
    error ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 bg-gray-50 text-navy focus:border-gold focus:ring-gold/20'
  }`;
}

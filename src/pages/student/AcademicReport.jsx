import { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { STUDENTS, calculateCGPA } from '../../data/students';
import { universityName } from '../../data/config';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { TrendingUp, Award, BookOpen, Download, ShieldCheck, ChevronDown, FileText, FileBadge } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function GradeBadge({ grade }) {
  const map = {
    'A+': 'bg-emerald-100 text-emerald-700',
    'A':  'bg-green-100 text-green-700',
    'B+': 'bg-blue-100 text-blue-700',
    'B':  'bg-sky-100 text-sky-700',
    'C':  'bg-yellow-100 text-yellow-700',
    'D':  'bg-orange-100 text-orange-700',
    'F':  'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${map[grade] || 'bg-gray-100 text-gray-600'}`}>
      {grade}
    </span>
  );
}

function getMockMarks(grade, code) {
  const map = { 'A+': 95, 'A': 85, 'B+': 76, 'B': 68, 'C': 55, 'D': 45, 'F': 35 };
  const base = map[grade] || '--';
  if (base === '--') return base;
  let numericStr = code.replace(/[^0-9]/g, '');
  const modifier = numericStr ? parseInt(numericStr) % 5 : 0; 
  return base + modifier;
}

function getTermName(sem, batchYear) {
  const yearOffset = Math.floor((sem - 1) / 2);
  const isAutumn = sem % 2 !== 0;
  const year = batchYear + yearOffset;
  return `${isAutumn ? 'Autumn' : 'Spring'} ${year}`;
}

const generatePDF = async (elementRef, filename) => {
  const element = elementRef.current;
  if (!element) return;
  
  // TODO: table page break — implement with backend PDF generation

  // hide any UI elements not meant for PDF temporarily if needed...
  // Since we scoped the ref tightly, it shouldn't capture UI buttons.
  
  const canvas = await html2canvas(element, { scale: 2 });
  const data = canvas.toDataURL('image/png');
  
  const pdfObj = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdfObj.internal.pageSize.getWidth();
  const pdfHeight = pdfObj.internal.pageSize.getHeight();
  const canvasRatio = canvas.height / canvas.width;
  let imgHeight = pdfWidth * canvasRatio;
  let heightLeft = imgHeight;
  let position = 0;

  pdfObj.addImage(data, 'PNG', 0, position, pdfWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdfObj.addPage();
    pdfObj.addImage(data, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;
  }
  
  pdfObj.save(filename);
};

export default function AcademicReport() {
  const { currentUser } = useAuth();
  const student = STUDENTS.find(s => s.rollNo === currentUser.id);

  const reportRef = useRef(null);
  const marksheetRef = useRef(null);

  const [downloadDropdown, setDownloadDropdown] = useState(false);
  const [selectedSemForMarksheet, setSelectedSemForMarksheet] = useState(null);

  if (!student) {
    return (
      <div className="p-8 text-center font-bold text-gray-500">
        Academic records not found for {currentUser.id}
      </div>
    );
  }

  const cgpa = calculateCGPA(student.academicRecord);
  const totalCredits = student.academicRecord.reduce((acc, sem) => acc + sem.courses.reduce((s, c) => s + c.credits, 0), 0);

  const chartData = student.academicRecord.map(s => ({
    name: `Sem ${s.semester}`,
    SGPA: s.sgpa,
  }));

  const handleDownloadFullReport = async () => {
    await generatePDF(reportRef, `${student.rollNo}_Academic_Report.pdf`);
  };

  const handleDownloadMarksheet = async (semObj) => {
    setSelectedSemForMarksheet(semObj);
    setDownloadDropdown(false);
    
    // allow react to render the hidden marksheet div first
    setTimeout(async () => {
      await generatePDF(marksheetRef, `${student.rollNo}_Sem_${semObj.semester}_Marksheet.pdf`);
    }, 100);
  };

  return (
    <div className="relative">
      {/* Action Bar */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-navy">Academic Report</h2>
          <p className="text-sm font-medium text-gray-500 mt-2">
            {student.name} · {student.rollNo} · {student.program}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Dropdown for individual marksheets */}
           <div className="relative">
             <button
               onClick={() => setDownloadDropdown(!downloadDropdown)}
               className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all shadow-sm"
             >
               <FileBadge className="w-4 h-4 text-emerald-600" />
               Download Marksheet <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
             </button>
             
             {downloadDropdown && (
               <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden text-sm">
                 <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 font-bold text-xs text-gray-500 uppercase tracking-widest">
                   Completed Semesters
                 </div>
                 {student.academicRecord.map(sem => (
                   <button
                     key={sem.semester}
                     onClick={() => handleDownloadMarksheet(sem)}
                     className="w-full text-left px-4 py-3 hover:bg-gold/10 font-bold text-navy border-b border-gray-50 last:border-0 transition-colors"
                   >
                     Semester {sem.semester}, {getTermName(sem.semester, student.batchYear)}
                   </button>
                 ))}
               </div>
             )}
           </div>

           <button
             onClick={handleDownloadFullReport}
             className="flex items-center gap-2 px-6 py-2.5 bg-navy text-white font-extrabold text-sm rounded-xl hover:bg-navy-light transition-all shadow-md focus:ring-4 focus:ring-navy/20"
           >
             <Download className="w-4 h-4" />
             Download Full Report
           </button>
        </div>
      </div>

      {/* Screen Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
        <SummaryCard
          icon={Award}
          label="Cumulative GPA"
          value={cgpa.toFixed(2)}
          sub="Out of 10.0"
          accent="bg-white border-gold/30 shadow-card"
          iconColor="text-gold bg-gold/10 p-2 rounded-xl"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Semesters Completed"
          value={student.academicRecord.length}
          sub="Total recorded"
          accent="bg-white border-navy/20 shadow-card"
          iconColor="text-navy bg-navy/10 p-2 rounded-xl"
        />
        <SummaryCard
          icon={BookOpen}
          label="Total Credits"
          value={totalCredits}
          sub="Successfully completed"
          accent="bg-white border-emerald-200 shadow-card"
          iconColor="text-emerald-600 bg-emerald-50 p-2 rounded-xl"
        />
      </div>

      {/* Full Report Area to be captured by PDF */}
      <div ref={reportRef} className="bg-white text-navy p-6 sm:p-10 rounded-3xl sm:rounded-[40px] shadow-sm mb-12 max-w-5xl mx-auto border border-gray-100">
        
        {/* PDF Header Section */}
        <div className="flex flex-col items-center mb-10 pb-8 border-b-2 border-navy border-opacity-20">
           <h1 className="text-4xl font-black text-navy uppercase tracking-widest">{universityName}</h1>
           <p className="text-sm font-bold text-gray-400 tracking-[0.2em] mt-2 mb-8 uppercase">Official Academic Transcript</p>
           
           <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-sm">
             <div><p className="text-xs uppercase font-extrabold text-gray-400 mb-1">Student Name</p><p className="font-extrabold text-navy">{student.name}</p></div>
             <div><p className="text-xs uppercase font-extrabold text-gray-400 mb-1">Roll Number</p><p className="font-extrabold text-navy">{student.rollNo}</p></div>
             <div><p className="text-xs uppercase font-extrabold text-gray-400 mb-1">Program</p><p className="font-extrabold text-navy">{student.program}</p></div>
             <div><p className="text-xs uppercase font-extrabold text-gray-400 mb-1">Total Credits</p><p className="font-extrabold text-navy">{totalCredits}</p></div>
           </div>
        </div>

        {/* Semesters & Badges */}
        <div className="space-y-10">
          {student.academicRecord.map(sem => {
            const semCredits = sem.courses.reduce((s,c)=>s+c.credits,0);
            const termName = getTermName(sem.semester, student.batchYear);

            return (
              <div key={sem.semester} className="flex flex-col">
                <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm break-inside-avoid">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-sm font-black text-navy uppercase tracking-wider">
                    Semester {sem.semester} <span className="text-gray-400 mx-2">|</span> {termName}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase">{semCredits} Credits</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white text-xs uppercase tracking-widest text-gray-400 border-b border-gray-200">
                        <th className="text-left px-6 py-4 font-black">Code</th>
                        <th className="text-left px-4 py-4 font-black">Subject Name</th>
                        <th className="text-center px-4 py-4 font-black">Credits</th>
                        <th className="text-center px-4 py-4 font-black">Marks</th>
                        <th className="text-center px-4 py-4 font-black">Grade</th>
                        <th className="text-right px-6 py-4 font-black">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sem.courses.map((c, i) => (
                        <tr key={c.code} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}>
                          <td className="px-6 py-3 font-black text-navy">{c.code}</td>
                          <td className="px-4 py-3 font-semibold text-gray-700">{c.name}</td>
                          <td className="text-center px-4 py-3 font-bold text-gray-500">{c.credits}</td>
                          <td className="text-center px-4 py-3 font-bold text-gray-700">{getMockMarks(c.grade, c.code)}</td>
                          <td className="text-center px-4 py-3"><GradeBadge grade={c.grade} /></td>
                          <td className="text-right px-6 py-3 font-black text-navy">{c.gradePoints}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">SGPA</span>
                    <span className="text-xl font-black text-navy">{sem.sgpa.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Badges underneath the table organically */}
              {sem.sgpa >= 8.5 && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm shadow-sm print:hidden mx-auto max-w-2xl mt-4 w-full">
                  <span className="text-xl">🏅</span> Vice Chancellor's List, Semester {sem.semester}
                </div>
              )}
              {sem.sgpa <= 5.0 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm shadow-sm print:hidden mx-auto max-w-2xl mt-4 w-full">
                  <AlertTriangle className="w-5 h-5 text-amber-500" /> ⚠️ Conditional Standing, Please meet your academic advisor (Semester {sem.semester})
                </div>
              )}
              
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center pt-8 border-t-2 border-navy border-opacity-20 break-inside-avoid w-full">
           <p className="text-xs uppercase font-extrabold tracking-widest text-gray-400 mb-2">Final Cumulative Result</p>
           <p className="text-4xl font-black text-navy tracking-tight">CGPA: {cgpa.toFixed(2)} <span className="text-xl text-gray-300">/ 10.0</span></p>
        </div>
      </div>

      {/* SGPA chart (Screen only) */}
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8 mb-8 flex flex-col items-center max-w-5xl mx-auto">
        <div className="w-full mb-8 text-center">
          <h3 className="text-2xl font-extrabold text-navy">SGPA Trend Line</h3>
          <p className="text-sm font-medium text-gray-500 mt-2">Performance across completed semesters</p>
        </div>
        
        <div className="w-full max-w-4xl">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }} axisLine={false} tickLine={false} dy={15} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }} axisLine={false} tickLine={false} dx={-15} />
              <Tooltip
                cursor={{ fill: '#f1f5f9', radius: 8 }}
                contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 'bold', color: '#0f172a' }}
                itemStyle={{ color: '#0f172a' }}
              />
              <Bar dataKey="SGPA" radius={[6, 6, 6, 6]} maxBarSize={48}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill="#0A1F44" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HIDDEN OFF-SCREEN SINGLE SEMESTER MARKSHEET DOM */}
      {selectedSemForMarksheet && (
        <div 
          ref={marksheetRef} 
          className="absolute" 
          style={{ top: '-9999px', left: '-9999px', width: '800px', backgroundColor: 'white', padding: '60px', color: '#0A1F44' }}
        >
          {/* Marksheet Header */}
          <div style={{ textAlign: 'center', borderBottom: '3px solid #0A1F44', paddingBottom: '30px', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#0A1F44', margin: 0 }}>{universityName}</h1>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b7280', letterSpacing: '4px', marginTop: '8px', textTransform: 'uppercase' }}>Semester Grade Report</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', fontSize: '14px' }}>
            <div>
              <p style={{ margin: '0 0 6px 0' }}><strong style={{ color: '#6b7280', textTransform: 'uppercase' }}>Student Name:</strong> <span style={{ fontWeight: '800', marginLeft: '6px' }}>{student.name}</span></p>
              <p style={{ margin: 0 }}><strong style={{ color: '#6b7280', textTransform: 'uppercase' }}>Roll Number:</strong> <span style={{ fontWeight: '800', marginLeft: '6px' }}>{student.rollNo}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 6px 0' }}><strong style={{ color: '#6b7280', textTransform: 'uppercase' }}>Program:</strong> <span style={{ fontWeight: '800', marginLeft: '6px' }}>{student.program}</span></p>
              <p style={{ margin: 0 }}><strong style={{ color: '#6b7280', textTransform: 'uppercase' }}>Term:</strong> <span style={{ fontWeight: '800', marginLeft: '6px' }}>Semester {selectedSemForMarksheet.semester}, {getTermName(selectedSemForMarksheet.semester, student.batchYear)}</span></p>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: 'white' }}>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Code</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold' }}>Subject</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'center' }}>Cr</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'center' }}>Total Marks</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'center' }}>Grade</th>
                <th style={{ padding: '12px 16px', fontWeight: 'bold', textAlign: 'right' }}>Pts</th>
              </tr>
            </thead>
            <tbody>
              {selectedSemForMarksheet.courses.map((c, i) => (
                <tr key={c.code} style={{ backgroundColor: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '800' }}>{c.code}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{c.name}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: '#64748b' }}>{c.credits}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold' }}>{getMockMarks(c.grade, c.code)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold' }}>{c.grade}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '800' }}>{c.gradePoints}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Notice & SGPA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
             <div style={{ width: '60%' }}>
               {selectedSemForMarksheet.sgpa >= 8.5 && (
                 <div style={{ border: '2px solid #10b981', backgroundColor: '#ecfdf5', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px' }}>
                   🏅 Vice Chancellor's List Honors
                 </div>
               )}
               {selectedSemForMarksheet.sgpa <= 5.0 && (
                 <div style={{ border: '2px solid #f59e0b', backgroundColor: '#fffbeb', color: '#92400e', padding: '12px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px' }}>
                   ⚠️ Conditional Standing, Please meet your academic advisor
                 </div>
               )}
             </div>
             <div style={{ textAlign: 'right', backgroundColor: '#f8fafc', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
               <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginRight: '16px' }}>SGPA</span>
               <span style={{ fontSize: '24px', fontWeight: '900', color: '#0A1F44' }}>{selectedSemForMarksheet.sgpa.toFixed(2)}</span>
             </div>
          </div>

          <div style={{ textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '20px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>
            This is a computer-generated marksheet., {universityName}
          </div>
        </div>
      )}
      
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, sub, accent, iconColor }) {
  return (
    <div className={`rounded-3xl border-2 p-6 flex flex-col justify-between items-start gap-4 ${accent}`}>
      <div className={`shrink-0 ${iconColor}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-4xl font-extrabold text-navy tracking-tight">{value}</p>
        <p className="text-sm text-gray-400 mt-2 font-semibold">↳ {sub}</p>
      </div>
    </div>
  );
}

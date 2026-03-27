import { useAuth } from '../../context/AuthContext';
import { STUDENTS, calculateCGPA } from '../../data/students';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { TrendingUp, Award, BookOpen, Download } from 'lucide-react';

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
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold print:border print:border-gray-300 print:text-black print:bg-transparent ${map[grade] || 'bg-gray-100 text-gray-600'}`}>
      {grade}
    </span>
  );
}

function getMockMarks(grade, code) {
  const map = { 'A+': 95, 'A': 85, 'B+': 76, 'B': 68, 'C': 55, 'D': 45, 'F': 35 };
  const base = map[grade] || '--';
  if (base === '--') return base;
  const modifier = code.charCodeAt(code.length - 1) % 5; 
  return base + modifier;
}

function getTermName(sem, batchYear) {
  const yearOffset = Math.floor((sem - 1) / 2);
  const isAutumn = sem % 2 !== 0;
  const year = batchYear + yearOffset;
  return `${isAutumn ? 'Autumn' : 'Spring'} ${year}`;
}

export default function AcademicReport() {
  const { currentUser } = useAuth();
  const student = STUDENTS.find(s => s.rollNo === currentUser.id);

  if (!student) {
    return (
      <div className="p-8 text-center text-gray-500">
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print:bg-white print:p-0 print:m-0">
      {/* Print Header (Hidden on screen) */}
      <div className="hidden print:block mb-8 border-b-2 border-navy pb-4 text-center">
        <h1 className="text-3xl font-extrabold text-navy">CompScience University</h1>
        <p className="text-gray-500 text-sm mt-1">Official Academic Report</p>
        
        <div className="grid grid-cols-2 gap-4 mt-6 text-left max-w-2xl mx-auto text-sm">
          <div><span className="font-bold text-gray-500">Student Name:</span> {student.name}</div>
          <div><span className="font-bold text-gray-500">Roll Number:</span> {student.rollNo}</div>
          <div><span className="font-bold text-gray-500">Program:</span> {student.program}</div>
          <div><span className="font-bold text-gray-500">Total Credits:</span> {totalCredits}</div>
        </div>
      </div>

      {/* Screen Page header */}
      <div className="flex justify-between items-start mb-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-navy">Academic Report</h2>
          <p className="text-sm text-gray-500 mt-1">
            {student.name} · {student.rollNo} · {student.program}
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gold/10 text-navy font-bold text-sm rounded-xl hover:bg-gold/20 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Screen Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4 print:hidden">
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

      {/* Semester tables */}
      <div className="space-y-6 mb-8 print:space-y-8 print:mb-0">
        {student.academicRecord.map(sem => {
          const semCredits = sem.courses.reduce((s,c)=>s+c.credits,0);
          const termName = getTermName(sem.semester, student.batchYear);

          return (
            <div key={sem.semester} className="bg-white rounded-2xl shadow-card print:shadow-none border border-gray-100 print:border-gray-400 overflow-hidden print:break-inside-avoid">
              <div className="px-6 py-4 border-b border-gray-100 print:border-gray-400 bg-gray-50/50 print:bg-gray-100">
                <h3 className="text-sm font-bold text-navy print:text-black">
                  Semester {sem.semester} — {termName} · {sem.courses.length} subjects · {semCredits} credits
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-navy text-white print:bg-gray-200 print:text-black text-xs uppercase tracking-wide">
                      <th className="text-left px-6 py-3 font-semibold rounded-tl-none">Code</th>
                      <th className="text-left px-4 py-3 font-semibold">Subject Name</th>
                      <th className="text-center px-4 py-3 font-semibold">Credits</th>
                      <th className="text-center px-4 py-3 font-semibold">Marks</th>
                      <th className="text-center px-4 py-3 font-semibold">Grade</th>
                      <th className="text-center px-4 py-3 font-semibold rounded-tr-none">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.courses.map((c, i) => (
                      <tr key={c.code} className={`border-b border-gray-50 print:border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} print:bg-white`}>
                        <td className="px-6 py-3 font-bold text-gold print:text-black">{c.code}</td>
                        <td className="px-4 py-3 text-navy font-medium print:text-black">{c.name}</td>
                        <td className="text-center px-4 py-3 text-gray-600 print:text-black">{c.credits}</td>
                        <td className="text-center px-4 py-3 text-gray-600 font-medium print:text-black">{getMockMarks(c.grade, c.code)}</td>
                        <td className="text-center px-4 py-3">
                          <GradeBadge grade={c.grade} />
                        </td>
                        <td className="text-center px-4 py-3 font-bold text-navy print:text-black">{c.gradePoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 print:border-gray-400 flex justify-end items-center bg-gray-50/20 print:bg-white">
                <div className="px-4 py-1.5 bg-gold/10 border border-gold/30 print:border-none print:p-0 rounded-xl shadow-sm print:shadow-none text-right inline-block">
                  <span className="text-xs text-navy print:text-gray-600 font-bold uppercase tracking-wider mr-2">SGPA:</span>
                  <span className="text-lg font-extrabold text-gold-dark print:text-black">{sem.sgpa.toFixed(2)} / 10</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SGPA chart */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-8 flex flex-col items-center print:hidden">
        <div className="w-full mb-6 text-center">
          <h3 className="text-xl font-bold text-navy">SGPA Trend</h3>
          <p className="text-sm text-gray-500 mt-1">Performance across completed semesters</p>
        </div>
        
        <div className="w-full max-w-3xl">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 'bold', color: '#0A1F44' }}
                itemStyle={{ color: '#C9A84C' }}
              />
              <Bar dataKey="SGPA" radius={[8, 8, 0, 0]} maxBarSize={60}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === chartData.length - 1 ? '#C9A84C' : '#0A1F44'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 text-center bg-navy px-8 py-4 rounded-2xl shadow-md w-full max-w-md mx-auto">
          <p className="text-xs text-gold font-bold uppercase tracking-widest mb-1">Overall Cumulative GPA</p>
          <p className="text-4xl font-extrabold text-white">
            CGPA: <span className="text-gold">{cgpa.toFixed(2)}</span> <span className="text-sm text-white/50 font-medium">/ 10.0</span>
          </p>
        </div>
      </div>
      
      {/* Print summary fallback */}
      <div className="hidden print:block text-right mt-8 pt-4 border-t-2 border-navy break-inside-avoid">
        <p className="text-xl font-extrabold text-black">Final CGPA: {cgpa.toFixed(2)} / 10.0</p>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, sub, accent, iconColor }) {
  return (
    <div className={`rounded-2xl border p-5 flex items-start gap-4 ${accent}`}>
      <div className={`mt-1 shrink-0 ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-extrabold text-navy">{value}</p>
        <p className="text-xs text-gray-400 mt-1 font-medium">{sub}</p>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Computer Science", "Physical Education"];
const GRADES_SCALE = [
  { grade: "A+", min: 95, gpa: 4.0 },
  { grade: "A",  min: 90, gpa: 4.0 },
  { grade: "A-", min: 85, gpa: 3.7 },
  { grade: "B+", min: 80, gpa: 3.3 },
  { grade: "B",  min: 75, gpa: 3.0 },
  { grade: "B-", min: 70, gpa: 2.7 },
  { grade: "C+", min: 65, gpa: 2.3 },
  { grade: "C",  min: 60, gpa: 2.0 },
  { grade: "D",  min: 50, gpa: 1.0 },
  { grade: "F",  min: 0,  gpa: 0.0 },
];

const getGradeInfo = (marks) => {
  for (const g of GRADES_SCALE) if (marks >= g.min) return g;
  return GRADES_SCALE[GRADES_SCALE.length - 1];
};

const calcGPA = (records) => {
  if (!records.length) return "0.00";
  return (records.reduce((a, r) => a + getGradeInfo(r.marks).gpa, 0) / records.length).toFixed(2);
};

const randMarks = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedRecords = () => {
  const sems = ["Sem 1 - 2023", "Sem 2 - 2023", "Sem 1 - 2024"];
  const result = {};
  sems.forEach((sem) => {
    result[sem] = SUBJECTS.slice(0, 6).map((sub) => ({
      subject: sub, marks: randMarks(55, 98), maxMarks: 100, credits: 3,
    }));
  });
  return result;
};

const INITIAL_STUDENTS = [
  { id: 1, name: "Aarav Sharma",  rollNo: "2024CS001", class: "A", dob: "2007-03-14", email: "aarav@school.edu",  phone: "9876543210", gender: "Male",   address: "12 MG Road, Delhi" },
  { id: 2, name: "Priya Verma",   rollNo: "2024CS002", class: "A", dob: "2007-07-22", email: "priya@school.edu",  phone: "9876543211", gender: "Female", address: "45 Park Street, Mumbai" },
  { id: 3, name: "Rohan Mehta",   rollNo: "2024CS003", class: "B", dob: "2006-11-05", email: "rohan@school.edu",  phone: "9876543212", gender: "Male",   address: "7 Lal Bagh, Bangalore" },
  { id: 4, name: "Sneha Gupta",   rollNo: "2024CS004", class: "B", dob: "2007-01-30", email: "sneha@school.edu",  phone: "9876543213", gender: "Female", address: "88 Civil Lines, Jaipur" },
  { id: 5, name: "Karan Patel",   rollNo: "2024CS005", class: "A", dob: "2008-05-18", email: "karan@school.edu",  phone: "9876543214", gender: "Male",   address: "3 Nehru Nagar, Ahmedabad" },
  { id: 6, name: "Nisha Joshi",   rollNo: "2024CS006", class: "A", dob: "2008-09-09", email: "nisha@school.edu",  phone: "9876543215", gender: "Female", address: "21 Rajpur Road, Dehradun" },
  { id: 7, name: "Amit Yadav",    rollNo: "2024CS007", class: "B", dob: "2007-12-25", email: "amit@school.edu",   phone: "9876543216", gender: "Male",   address: "56 Station Road, Lucknow" },
  { id: 8, name: "Pooja Singh",   rollNo: "2024CS008", class: "B", dob: "2008-02-14", email: "pooja@school.edu",  phone: "9876543217", gender: "Female", address: "9 Gandhi Chowk, Patna" },
];

const SEMESTERS = ["Sem 1 - 2023", "Sem 2 - 2023", "Sem 1 - 2024"];
const CLASSES   = ["All", "A", "B"];

const avatar = (name) => name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

const gpaColor = (gpa) => {
  const g = parseFloat(gpa);
  if (g >= 3.7) return { text:"#065f46", bg:"#d1fae5" };
  if (g >= 3.0) return { text:"#1e40af", bg:"#dbeafe" };
  if (g >= 2.0) return { text:"#92400e", bg:"#fef3c7" };
  return { text:"#7f1d1d", bg:"#fee2e2" };
};

const gradeColor = (grade) => {
  if (["A+","A","A-"].includes(grade)) return { text:"#065f46", bg:"#d1fae5" };
  if (["B+","B","B-"].includes(grade)) return { text:"#1e40af", bg:"#dbeafe" };
  if (["C+","C"].includes(grade))       return { text:"#92400e", bg:"#fef3c7" };
  if (grade === "D")                     return { text:"#c2410c", bg:"#ffedd5" };
  return { text:"#7f1d1d", bg:"#fee2e2" };
};

export default function SARMS_Academic() {
  const [tab,             setTab]             = useState("dashboard");
  const [students,        setStudents]        = useState(INITIAL_STUDENTS);
  const [academicRecords, setAcademicRecords] = useState(() => {
    const r = {}; INITIAL_STUDENTS.forEach(s => { r[s.id] = seedRecords(); }); return r;
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileTab,      setProfileTab]      = useState("overview");
  const [filterClass,     setFilterClass]     = useState("All");
  const [searchQ,         setSearchQ]         = useState("");
  const [showAddStudent,  setShowAddStudent]  = useState(false);
  const [showAddMarks,    setShowAddMarks]    = useState(false);
  const [editMarks,       setEditMarks]       = useState(null);
  const [newMarksValue,   setNewMarksValue]   = useState("");
  const [activeSem,       setActiveSem]       = useState(SEMESTERS[2]);
  const [sortBy,          setSortBy]          = useState("name");
  const [newStudent,      setNewStudent]      = useState({ name:"", rollNo:"", class:"A", dob:"", email:"", phone:"", gender:"Male", address:"" });
  const [newSem,          setNewSem]          = useState(SEMESTERS[0]);
  const [newSubjectMarks, setNewSubjectMarks] = useState(SUBJECTS.slice(0,6).reduce((a,s) => ({...a,[s]:""}),{}));

  const filteredStudents = useMemo(() => {
    let list = students.filter(s =>
      (filterClass === "All" || s.class === filterClass) &&
      (s.name.toLowerCase().includes(searchQ.toLowerCase()) || s.rollNo.toLowerCase().includes(searchQ.toLowerCase()))
    );
    if (sortBy === "name")  list.sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === "gpa")   list.sort((a,b) => parseFloat(studentGPA(b.id)) - parseFloat(studentGPA(a.id)));
    if (sortBy === "class") list.sort((a,b) => a.class.localeCompare(b.class));
    return list;
  }, [students, filterClass, searchQ, sortBy, academicRecords]);

  const studentGPA    = (id)      => calcGPA(Object.values(academicRecords[id] || {}).flat());
  const studentSemGPA = (id, sem) => calcGPA((academicRecords[id] || {})[sem] || []);

  const addStudent = () => {
    if (!newStudent.name || !newStudent.rollNo) return;
    const id = Date.now();
    setStudents(p => [...p, { ...newStudent, id }]);
    setAcademicRecords(p => ({ ...p, [id]: {} }));
    setNewStudent({ name:"", rollNo:"", class:"A", dob:"", email:"", phone:"", gender:"Male", address:"" });
    setShowAddStudent(false);
  };

  const deleteStudent = (id) => {
    setStudents(p => p.filter(s => s.id !== id));
    setAcademicRecords(p => { const n = {...p}; delete n[id]; return n; });
    if (selectedStudent?.id === id) setSelectedStudent(null);
  };

  const saveMarksEdit = () => {
    if (!editMarks) return;
    const val = parseInt(newMarksValue);
    if (isNaN(val) || val < 0 || val > 100) return;
    setAcademicRecords(p => {
      const r = JSON.parse(JSON.stringify(p));
      r[editMarks.studentId][editMarks.sem][editMarks.subjectIdx].marks = val;
      return r;
    });
    setEditMarks(null); setNewMarksValue("");
  };

  const addSemRecords = () => {
    if (!selectedStudent) return;
    const sid = selectedStudent.id;
    const entries = SUBJECTS.slice(0,6).map(sub => ({ subject:sub, marks:parseInt(newSubjectMarks[sub])||0, maxMarks:100, credits:3 }));
    setAcademicRecords(p => ({ ...p, [sid]: { ...(p[sid]||{}), [newSem]: entries } }));
    setShowAddMarks(false);
  };

  const totalStudents = students.length;
  const allGPAs       = students.map(s => parseFloat(studentGPA(s.id)));
  const avgGPA        = allGPAs.length ? (allGPAs.reduce((a,b)=>a+b,0)/allGPAs.length).toFixed(2) : "0.00";
  const topStudents   = [...students].sort((a,b) => parseFloat(studentGPA(b.id)) - parseFloat(studentGPA(a.id))).slice(0,5);
  const atRisk        = students.filter(s => parseFloat(studentGPA(s.id)) < 2.0);

  const NavTab = ({ id, label }) => (
    <button onClick={() => { setTab(id); setSelectedStudent(null); }} style={{
      background:"none", border:"none", cursor:"pointer", padding:"18px 8px",
      fontSize:14, fontWeight: tab===id ? 700 : 400,
      color: tab===id ? "#0f172a" : "#64748b",
      borderBottom: tab===id ? "2.5px solid #6366f1" : "2.5px solid transparent",
      transition:"all 0.15s", whiteSpace:"nowrap",
    }}>{label}</button>
  );

  const Badge = ({ text, color, bg }) => (
    <span style={{ background:bg, color, borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:700 }}>{text}</span>
  );

  const StatCard = ({ label, value, sub, accent }) => (
    <div style={{ background:"#fff", borderRadius:14, padding:"20px 22px", border:`1.5px solid ${accent}33`, flex:1, minWidth:140 }}>
      <div style={{ fontSize:11, color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:30, fontWeight:900, color:accent, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:"#94a3b8", marginTop:6 }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:"#f1f5f9", minHeight:"100vh", color:"#0f172a" }}>

      {/* Nav */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"0 28px", display:"flex", alignItems:"center", gap:4, position:"sticky", top:0, zIndex:50 }}>
        <div style={{ marginRight:28, padding:"14px 0", flexShrink:0 }}>
          <div style={{ fontWeight:900, fontSize:17, letterSpacing:-0.5 }}><span style={{ color:"#6366f1" }}>■</span> SARMS</div>
          <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:1, fontWeight:600 }}>ACADEMIC RECORDS</div>
        </div>
        {[["dashboard","Dashboard"],["students","Students"],["grades","Grade Book"],["transcript","Transcripts"],["analytics","Analytics"]].map(([id,label]) => (
          <NavTab key={id} id={id} label={label} />
        ))}
      </div>

      <div style={{ maxWidth:1120, margin:"0 auto", padding:"28px 20px" }}>

        {/* ── DASHBOARD ── */}
        {tab==="dashboard" && (
          <div>
            <div style={{ marginBottom:24 }}>
              <h1 style={{ margin:0, fontSize:26, fontWeight:900, letterSpacing:-0.5 }}>Academic Overview</h1>
              <p style={{ margin:"4px 0 0", color:"#64748b", fontSize:14 }}>School Year 2023–2024</p>
            </div>
            <div style={{ display:"flex", gap:16, marginBottom:28, flexWrap:"wrap" }}>
              <StatCard label="Total Students" value={totalStudents} sub="Across all classes" accent="#6366f1" />
              <StatCard label="Average GPA"    value={avgGPA}        sub="Cumulative all semesters" accent="#10b981" />
              <StatCard label="Top Performers" value={students.filter(s=>parseFloat(studentGPA(s.id))>=3.7).length} sub="GPA ≥ 3.7" accent="#f59e0b" />
              <StatCard label="At Risk"         value={atRisk.length} sub="GPA < 2.0" accent="#ef4444" />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:20, marginBottom:20 }}>
              <div style={{ background:"#fff", borderRadius:14, padding:22, border:"1px solid #e2e8f0" }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:16, display:"flex", justifyContent:"space-between" }}>
                  <span>Top Performers</span>
                  <span style={{ fontSize:12, color:"#94a3b8", fontWeight:400 }}>By cumulative GPA</span>
                </div>
                {topStudents.map((s,i) => {
                  const gpa = studentGPA(s.id); const gc = gpaColor(gpa);
                  return (
                    <div key={s.id} onClick={() => { setSelectedStudent(s); setTab("students"); setProfileTab("overview"); }}
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<4?"1px solid #f1f5f9":"none", cursor:"pointer" }}>
                      <div style={{ width:22, fontSize:12, fontWeight:700, color:["#f59e0b","#94a3b8","#b45309","#64748b","#64748b"][i] }}>#{i+1}</div>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#6366f1" }}>{avatar(s.name)}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:600 }}>{s.name}</div>
                        <div style={{ fontSize:12, color:"#94a3b8" }}>{s.rollNo} · {s.class}</div>
                      </div>
                      <div style={{ background:gc.bg, color:gc.text, padding:"4px 12px", borderRadius:20, fontSize:13, fontWeight:800 }}>{gpa}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background:"#fff", borderRadius:14, padding:22, border:"1px solid #e2e8f0" }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Class Distribution</div>
                {["A","B","A","B"].map(cls => {
                  const cs = students.filter(s=>s.class===cls);
                  const cAvg = cs.length ? (cs.reduce((a,s)=>a+parseFloat(studentGPA(s.id)),0)/cs.length).toFixed(2) : "0.00";
                  const pct  = totalStudents ? Math.round((cs.length/totalStudents)*100) : 0;
                  return (
                    <div key={cls} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:5 }}>
                        <span style={{ fontWeight:600 }}>Class {cls}</span>
                        <span style={{ color:"#64748b" }}>{cs.length} students · {cAvg}</span>
                      </div>
                      <div style={{ background:"#f1f5f9", borderRadius:8, height:8, overflow:"hidden" }}>
                        <div style={{ background:"linear-gradient(90deg,#6366f1,#8b5cf6)", width:`${pct}%`, height:"100%", borderRadius:8 }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid #f1f5f9" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>GPA Bands</div>
                  {[["A  (≥ 3.7)",s=>parseFloat(studentGPA(s.id))>=3.7,"#10b981"],
                    ["B  (3.0–3.6)",s=>{const g=parseFloat(studentGPA(s.id));return g>=3.0&&g<3.7;},"#6366f1"],
                    ["C  (2.0–2.9)",s=>{const g=parseFloat(studentGPA(s.id));return g>=2.0&&g<3.0;},"#f59e0b"],
                    ["D/F (<2.0)",s=>parseFloat(studentGPA(s.id))<2.0,"#ef4444"],
                  ].map(([label,fn,color]) => (
                    <div key={label} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <div style={{ width:10, height:10, borderRadius:2, background:color, flexShrink:0 }} />
                      <span style={{ fontSize:12, flex:1, color:"#475569" }}>{label}</span>
                      <span style={{ fontSize:12, fontWeight:700 }}>{students.filter(fn).length}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {atRisk.length > 0 && (
              <div style={{ background:"#fef2f2", borderRadius:14, padding:18, border:"1px solid #fecaca" }}>
                <div style={{ fontWeight:700, fontSize:14, color:"#dc2626", marginBottom:10 }}>⚠ Academic Risk — {atRisk.length} student{atRisk.length>1?"s":""} below GPA 2.0</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {atRisk.map(s => (
                    <div key={s.id} onClick={() => { setSelectedStudent(s); setTab("students"); setProfileTab("overview"); }}
                      style={{ background:"#fff", border:"1px solid #fca5a5", borderRadius:10, padding:"8px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", background:"#fee2e2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"#dc2626" }}>{avatar(s.name)}</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600 }}>{s.name}</div>
                        <div style={{ fontSize:11, color:"#94a3b8" }}>GPA {studentGPA(s.id)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STUDENTS LIST ── */}
        {tab==="students" && !selectedStudent && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <h1 style={{ margin:0, fontSize:24, fontWeight:900, letterSpacing:-0.5 }}>Students</h1>
                <p style={{ margin:"3px 0 0", color:"#64748b", fontSize:14 }}>{filteredStudents.length} records</p>
              </div>
              <button onClick={() => setShowAddStudent(true)} style={{ background:"#6366f1", color:"#fff", border:"none", borderRadius:10, padding:"10px 20px", fontWeight:700, fontSize:14, cursor:"pointer" }}>+ Add Student</button>
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
              <input placeholder="Search name or roll no…" value={searchQ} onChange={e=>setSearchQ(e.target.value)}
                style={{ flex:1, minWidth:200, padding:"9px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, background:"#fff" }} />
              <select value={filterClass} onChange={e=>setFilterClass(e.target.value)}
                style={{ padding:"9px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, background:"#fff" }}>
                {CLASSES.map(c=><option key={c}>{c}</option>)}
              </select>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                style={{ padding:"9px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, background:"#fff" }}>
                <option value="name">Sort: Name</option>
                <option value="gpa">Sort: GPA</option>
                <option value="class">Sort: Class</option>
              </select>
            </div>
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#f8fafc" }}>
                    {["Student","Roll No","Class","Cumulative GPA","Latest Sem GPA","Actions"].map(h=>(
                      <th key={h} style={{ padding:"13px 18px", textAlign:"left", fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:0.8, textTransform:"uppercase", borderBottom:"1px solid #e2e8f0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s,i) => {
                    const gpa      = studentGPA(s.id);
                    const latestGpa = studentSemGPA(s.id, SEMESTERS[SEMESTERS.length-1]);
                    const gc = gpaColor(gpa);
                    return (
                      <tr key={s.id} style={{ borderBottom:"1px solid #f1f5f9" }}
                        onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                        onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <td style={{ padding:"14px 18px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ width:38, height:38, borderRadius:"50%", background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#6366f1", flexShrink:0 }}>{avatar(s.name)}</div>
                            <div>
                              <div style={{ fontSize:14, fontWeight:700 }}>{s.name}</div>
                              <div style={{ fontSize:12, color:"#94a3b8" }}>{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:"14px 18px", fontSize:13, color:"#475569", fontWeight:600 }}>{s.rollNo}</td>
                        <td style={{ padding:"14px 18px" }}><span style={{ background:"#f1f5f9", color:"#475569", padding:"3px 10px", borderRadius:20, fontWeight:700, fontSize:12 }}>{s.class}</span></td>
                        <td style={{ padding:"14px 18px" }}><span style={{ background:gc.bg, color:gc.text, padding:"5px 14px", borderRadius:20, fontWeight:800, fontSize:14 }}>{gpa}</span></td>
                        <td style={{ padding:"14px 18px" }}><span style={{ background:gpaColor(latestGpa).bg, color:gpaColor(latestGpa).text, padding:"4px 12px", borderRadius:20, fontWeight:700, fontSize:13 }}>{latestGpa}</span></td>
                        <td style={{ padding:"14px 18px" }}>
                          <div style={{ display:"flex", gap:8 }}>
                            <button onClick={() => { setSelectedStudent(s); setProfileTab("overview"); }}
                              style={{ background:"#eef2ff", color:"#6366f1", border:"none", borderRadius:8, padding:"6px 14px", fontWeight:700, fontSize:12, cursor:"pointer" }}>View</button>
                            <button onClick={() => deleteStudent(s.id)}
                              style={{ background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:8, padding:"6px 12px", fontWeight:700, fontSize:12, cursor:"pointer" }}>✕</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── STUDENT PROFILE ── */}
        {tab==="students" && selectedStudent && (() => {
          const s    = selectedStudent;
          const recs = academicRecords[s.id] || {};
          const gpa  = studentGPA(s.id);
          const gc   = gpaColor(gpa);
          return (
            <div>
              <button onClick={() => setSelectedStudent(null)}
                style={{ background:"none", border:"none", color:"#6366f1", fontWeight:700, fontSize:14, cursor:"pointer", marginBottom:16 }}>← Back to Students</button>

              <div style={{ background:"#fff", borderRadius:14, padding:24, border:"1px solid #e2e8f0", marginBottom:20, display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:"#6366f1", flexShrink:0 }}>{avatar(s.name)}</div>
                <div style={{ flex:1 }}>
                  <h2 style={{ margin:0, fontSize:22, fontWeight:900 }}>{s.name}</h2>
                  <div style={{ color:"#64748b", fontSize:14, marginTop:2 }}>{s.rollNo} · Class {s.class} · {s.gender}</div>
                  <div style={{ color:"#94a3b8", fontSize:13, marginTop:2 }}>{s.email} · {s.phone}</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:11, color:"#94a3b8", fontWeight:700, marginBottom:4, letterSpacing:0.8 }}>CUMULATIVE GPA</div>
                  <div style={{ fontSize:36, fontWeight:900, color:gc.text, background:gc.bg, padding:"8px 20px", borderRadius:12 }}>{gpa}</div>
                </div>
                <button onClick={() => setShowAddMarks(true)} style={{ background:"#6366f1", color:"#fff", border:"none", borderRadius:10, padding:"10px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ Add Semester</button>
              </div>

              <div style={{ display:"flex", gap:4, borderBottom:"1px solid #e2e8f0", marginBottom:20 }}>
                {[["overview","Overview"],["grades","Grades"],["info","Personal Info"]].map(([id,label]) => (
                  <button key={id} onClick={() => setProfileTab(id)} style={{
                    background:"none", border:"none", cursor:"pointer", padding:"10px 16px", fontSize:14,
                    fontWeight:profileTab===id?700:400, color:profileTab===id?"#6366f1":"#64748b",
                    borderBottom:profileTab===id?"2.5px solid #6366f1":"2.5px solid transparent",
                  }}>{label}</button>
                ))}
              </div>

              {profileTab==="overview" && (
                <div>
                  <div style={{ display:"flex", gap:14, marginBottom:20, flexWrap:"wrap" }}>
                    {SEMESTERS.map(sem => {
                      const sg  = studentSemGPA(s.id, sem);
                      const gc2 = gpaColor(sg);
                      const sr  = recs[sem] || [];
                      const avg = sr.length ? Math.round(sr.reduce((a,r)=>a+r.marks,0)/sr.length) : 0;
                      return (
                        <div key={sem} style={{ background:"#fff", borderRadius:12, padding:"16px 20px", border:"1px solid #e2e8f0", flex:1, minWidth:150 }}>
                          <div style={{ fontSize:11, color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>{sem}</div>
                          <div style={{ fontSize:24, fontWeight:900, color:gc2.text }}>{sg}</div>
                          <div style={{ fontSize:12, color:"#64748b", marginTop:4 }}>Avg marks: {avg}%</div>
                        </div>
                      );
                    })}
                  </div>
                  {SEMESTERS.map(sem => {
                    const sr = recs[sem] || [];
                    if (!sr.length) return null;
                    return (
                      <div key={sem} style={{ background:"#fff", borderRadius:12, padding:"18px 20px", border:"1px solid #e2e8f0", marginBottom:16 }}>
                        <div style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>{sem}</div>
                        {sr.map((r,idx) => {
                          const gi  = getGradeInfo(r.marks);
                          const gc3 = gradeColor(gi.grade);
                          return (
                            <div key={r.subject} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                              <div style={{ width:150, fontSize:13, color:"#475569", fontWeight:500, flexShrink:0 }}>{r.subject}</div>
                              <div style={{ flex:1, background:"#f1f5f9", borderRadius:8, height:10, overflow:"hidden" }}>
                                <div style={{ width:`${r.marks}%`, height:"100%", borderRadius:8, background:r.marks>=90?"#10b981":r.marks>=75?"#6366f1":r.marks>=60?"#f59e0b":"#ef4444" }} />
                              </div>
                              <div style={{ width:36, fontSize:13, fontWeight:700, textAlign:"right" }}>{r.marks}</div>
                              <span style={{ background:gc3.bg, color:gc3.text, padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:800, width:32, textAlign:"center" }}>{gi.grade}</span>
                              {editMarks?.studentId===s.id && editMarks.sem===sem && editMarks.subjectIdx===idx ? (
                                <div style={{ display:"flex", gap:4 }}>
                                  <input type="number" min={0} max={100} value={newMarksValue} onChange={e=>setNewMarksValue(e.target.value)}
                                    style={{ width:56, padding:"3px 6px", borderRadius:6, border:"1.5px solid #6366f1", fontSize:13 }} />
                                  <button onClick={saveMarksEdit} style={{ background:"#6366f1", color:"#fff", border:"none", borderRadius:6, padding:"3px 8px", fontSize:12, cursor:"pointer" }}>✓</button>
                                  <button onClick={() => setEditMarks(null)} style={{ background:"#f1f5f9", color:"#475569", border:"none", borderRadius:6, padding:"3px 8px", fontSize:12, cursor:"pointer" }}>✕</button>
                                </div>
                              ) : (
                                <button onClick={() => { setEditMarks({studentId:s.id,sem,subjectIdx:idx}); setNewMarksValue(r.marks); }}
                                  style={{ background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:13, padding:"2px 6px" }}>✎</button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}

              {profileTab==="grades" && (
                <div>
                  {SEMESTERS.map(sem => {
                    const sr = recs[sem]||[];
                    if (!sr.length) return <div key={sem} style={{ color:"#94a3b8", fontSize:13, marginBottom:8 }}>No records for {sem}</div>;
                    const sg = studentSemGPA(s.id, sem);
                    return (
                      <div key={sem} style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden", marginBottom:16 }}>
                        <div style={{ background:"#f8fafc", padding:"12px 18px", borderBottom:"1px solid #e2e8f0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontWeight:700, fontSize:15 }}>{sem}</span>
                          <span style={{ fontSize:13, color:"#64748b" }}>Semester GPA: <strong style={{ color:gpaColor(sg).text }}>{sg}</strong></span>
                        </div>
                        <table style={{ width:"100%", borderCollapse:"collapse" }}>
                          <thead>
                            <tr style={{ background:"#f8fafc" }}>
                              {["Subject","Marks / 100","Grade","GPA Points","Status"].map(h=>(
                                <th key={h} style={{ padding:"10px 18px", textAlign:"left", fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:0.6 }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sr.map(r => {
                              const gi  = getGradeInfo(r.marks);
                              const gc3 = gradeColor(gi.grade);
                              return (
                                <tr key={r.subject} style={{ borderBottom:"1px solid #f1f5f9" }}>
                                  <td style={{ padding:"12px 18px", fontSize:14, fontWeight:500 }}>{r.subject}</td>
                                  <td style={{ padding:"12px 18px", fontSize:14 }}>{r.marks}</td>
                                  <td style={{ padding:"12px 18px" }}><Badge text={gi.grade} color={gc3.text} bg={gc3.bg} /></td>
                                  <td style={{ padding:"12px 18px", fontSize:14, fontWeight:600 }}>{gi.gpa.toFixed(1)}</td>
                                  <td style={{ padding:"12px 18px" }}><Badge text={r.marks>=50?"Pass":"Fail"} color={r.marks>=50?"#065f46":"#7f1d1d"} bg={r.marks>=50?"#d1fae5":"#fee2e2"} /></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )}

              {profileTab==="info" && (
                <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:24 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                    {[["Full Name",s.name],["Roll Number",s.rollNo],["Class",s.class],["Gender",s.gender],["Date of Birth",s.dob],["Email",s.email],["Phone",s.phone],["Address",s.address]].map(([label,val])=>(
                      <div key={label}>
                        <div style={{ fontSize:11, color:"#94a3b8", fontWeight:700, textTransform:"uppercase", letterSpacing:0.8, marginBottom:4 }}>{label}</div>
                        <div style={{ fontSize:14, fontWeight:500, color:"#1e293b" }}>{val||"—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showAddMarks && (
                <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
                  <div style={{ background:"#fff", borderRadius:16, padding:28, width:440, maxHeight:"85vh", overflowY:"auto" }}>
                    <h3 style={{ margin:"0 0 18px", fontWeight:800 }}>Add Semester Records</h3>
                    <div style={{ marginBottom:16 }}>
                      <label style={{ fontSize:11, color:"#64748b", fontWeight:700, display:"block", marginBottom:4, textTransform:"uppercase" }}>Semester</label>
                      <select value={newSem} onChange={e=>setNewSem(e.target.value)} style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1.5px solid #e2e8f0", fontSize:14 }}>
                        {SEMESTERS.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                    {SUBJECTS.slice(0,6).map(sub=>(
                      <div key={sub} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                        <label style={{ flex:1, fontSize:14, color:"#475569" }}>{sub}</label>
                        <input type="number" min={0} max={100} placeholder="0–100" value={newSubjectMarks[sub]}
                          onChange={e=>setNewSubjectMarks(p=>({...p,[sub]:e.target.value}))}
                          style={{ width:80, padding:"7px 10px", borderRadius:8, border:"1.5px solid #e2e8f0", fontSize:14 }} />
                      </div>
                    ))}
                    <div style={{ display:"flex", gap:10, marginTop:20 }}>
                      <button onClick={addSemRecords} style={{ flex:1, background:"#6366f1", color:"#fff", border:"none", borderRadius:10, padding:11, fontWeight:700, fontSize:14, cursor:"pointer" }}>Save Records</button>
                      <button onClick={() => setShowAddMarks(false)} style={{ flex:1, background:"#f1f5f9", color:"#475569", border:"none", borderRadius:10, padding:11, fontWeight:600, fontSize:14, cursor:"pointer" }}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ── GRADE BOOK ── */}
        {tab==="grades" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <h1 style={{ margin:0, fontSize:24, fontWeight:900 }}>Grade Book</h1>
                <p style={{ margin:"3px 0 0", color:"#64748b", fontSize:14 }}>Semester-wise marks overview</p>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <select value={filterClass} onChange={e=>setFilterClass(e.target.value)} style={{ padding:"9px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, background:"#fff" }}>
                  {CLASSES.map(c=><option key={c}>{c}</option>)}
                </select>
                <select value={activeSem} onChange={e=>setActiveSem(e.target.value)} style={{ padding:"9px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, background:"#fff" }}>
                  {SEMESTERS.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:820 }}>
                <thead>
                  <tr style={{ background:"#f8fafc" }}>
                    <th style={{ padding:"13px 18px", textAlign:"left", fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:0.8, borderBottom:"1px solid #e2e8f0" }}>STUDENT</th>
                    {SUBJECTS.slice(0,6).map(sub=>(
                      <th key={sub} style={{ padding:"13px 10px", textAlign:"center", fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:0.5, borderBottom:"1px solid #e2e8f0", whiteSpace:"nowrap" }}>{sub.slice(0,7)}</th>
                    ))}
                    <th style={{ padding:"13px 14px", textAlign:"center", fontSize:11, fontWeight:700, color:"#64748b", letterSpacing:0.8, borderBottom:"1px solid #e2e8f0" }}>SEM GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s,i) => {
                    const sr  = (academicRecords[s.id]||{})[activeSem]||[];
                    const sg  = studentSemGPA(s.id, activeSem);
                    const gc  = gpaColor(sg);
                    return (
                      <tr key={s.id} style={{ borderBottom:"1px solid #f1f5f9", background:i%2===0?"#fff":"#fafbfc" }}>
                        <td style={{ padding:"12px 18px" }}>
                          <div style={{ fontWeight:600, fontSize:14 }}>{s.name}</div>
                          <div style={{ fontSize:11, color:"#94a3b8" }}>{s.class}</div>
                        </td>
                        {SUBJECTS.slice(0,6).map(sub => {
                          const rec = sr.find(r=>r.subject===sub);
                          if (!rec) return <td key={sub} style={{ padding:"12px 10px", textAlign:"center", fontSize:12, color:"#cbd5e1" }}>—</td>;
                          const gi  = getGradeInfo(rec.marks);
                          const gc3 = gradeColor(gi.grade);
                          return (
                            <td key={sub} style={{ padding:"12px 10px", textAlign:"center" }}>
                              <div style={{ fontSize:13, fontWeight:700 }}>{rec.marks}</div>
                              <span style={{ background:gc3.bg, color:gc3.text, padding:"1px 6px", borderRadius:10, fontSize:10, fontWeight:800 }}>{gi.grade}</span>
                            </td>
                          );
                        })}
                        <td style={{ padding:"12px 14px", textAlign:"center" }}>
                          <span style={{ background:gc.bg, color:gc.text, padding:"5px 12px", borderRadius:20, fontWeight:800, fontSize:14 }}>{sg}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TRANSCRIPTS ── */}
        {tab==="transcript" && (
          <div>
            <div style={{ marginBottom:20 }}>
              <h1 style={{ margin:0, fontSize:24, fontWeight:900 }}>Transcripts</h1>
              <p style={{ margin:"3px 0 0", color:"#64748b", fontSize:14 }}>{selectedStudent ? "Viewing transcript" : "Select a student"}</p>
            </div>
            {!selectedStudent ? (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14 }}>
                {students.map(s => {
                  const gpa=studentGPA(s.id); const gc=gpaColor(gpa);
                  return (
                    <div key={s.id} onClick={() => setSelectedStudent(s)}
                      style={{ background:"#fff", borderRadius:12, padding:18, border:"1px solid #e2e8f0", cursor:"pointer" }}
                      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(99,102,241,0.12)"}
                      onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                        <div style={{ width:40, height:40, borderRadius:"50%", background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#6366f1" }}>{avatar(s.name)}</div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:14 }}>{s.name}</div>
                          <div style={{ fontSize:11, color:"#94a3b8" }}>{s.rollNo}</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                        <span style={{ color:"#64748b" }}>Class {s.class}</span>
                        <span style={{ background:gc.bg, color:gc.text, padding:"2px 10px", borderRadius:20, fontWeight:800, fontSize:12 }}>GPA {gpa}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (() => {
              const s   = selectedStudent;
              const recs = academicRecords[s.id]||{};
              const gpa  = studentGPA(s.id); const gc = gpaColor(gpa);
              return (
                <div>
                  <button onClick={() => setSelectedStudent(null)} style={{ background:"none", border:"none", color:"#6366f1", fontWeight:700, fontSize:14, cursor:"pointer", marginBottom:16 }}>← All Students</button>
                  <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>
                    <div style={{ background:"#0f172a", color:"#fff", padding:"28px 32px", textAlign:"center" }}>
                      <div style={{ fontSize:11, letterSpacing:3, color:"#94a3b8", marginBottom:6, textTransform:"uppercase" }}>Official Academic Transcript</div>
                      <div style={{ fontSize:24, fontWeight:900, marginBottom:4 }}>Delhi Public School</div>
                      <div style={{ fontSize:12, color:"#94a3b8" }}>New Delhi · Affiliated to CBSE · Estd. 1985</div>
                    </div>
                    <div style={{ padding:"24px 32px", borderBottom:"1px solid #e2e8f0", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
                      <div>
                        <div style={{ fontSize:11, color:"#94a3b8", fontWeight:700, letterSpacing:0.8, marginBottom:2 }}>STUDENT NAME</div>
                        <div style={{ fontSize:18, fontWeight:800 }}>{s.name}</div>
                      </div>
                      {[["Roll Number",s.rollNo],["Class",s.class],["Date of Birth",s.dob]].map(([l,v])=>(
                        <div key={l}>
                          <div style={{ fontSize:11, color:"#94a3b8", fontWeight:700, letterSpacing:0.8, marginBottom:2 }}>{l.toUpperCase()}</div>
                          <div style={{ fontSize:14, fontWeight:600 }}>{v}</div>
                        </div>
                      ))}
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:11, color:"#94a3b8", fontWeight:700, letterSpacing:0.8, marginBottom:4 }}>CUMULATIVE GPA</div>
                        <div style={{ fontSize:28, fontWeight:900, color:gc.text, background:gc.bg, padding:"6px 18px", borderRadius:10, display:"inline-block" }}>{gpa}</div>
                      </div>
                    </div>
                    {SEMESTERS.map(sem => {
                      const sr = recs[sem]||[]; if (!sr.length) return null;
                      const sg  = studentSemGPA(s.id,sem);
                      const avg = Math.round(sr.reduce((a,r)=>a+r.marks,0)/sr.length);
                      return (
                        <div key={sem} style={{ padding:"0 32px 24px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 0 12px", borderBottom:"2px solid #0f172a" }}>
                            <span style={{ fontWeight:800, fontSize:15 }}>{sem}</span>
                            <span style={{ fontSize:13, color:"#64748b" }}>Avg: {avg}% · GPA: <strong style={{ color:gpaColor(sg).text }}>{sg}</strong></span>
                          </div>
                          <table style={{ width:"100%", borderCollapse:"collapse" }}>
                            <thead>
                              <tr style={{ borderBottom:"1px solid #e2e8f0" }}>
                                {["Subject","Marks","Max","Grade","GPA","Result"].map(h=>(
                                  <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:0.6 }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {sr.map(r => {
                                const gi  = getGradeInfo(r.marks); const gc3 = gradeColor(gi.grade);
                                return (
                                  <tr key={r.subject} style={{ borderBottom:"1px solid #f8fafc" }}>
                                    <td style={{ padding:"9px 12px", fontSize:13 }}>{r.subject}</td>
                                    <td style={{ padding:"9px 12px", fontSize:13, fontWeight:700 }}>{r.marks}</td>
                                    <td style={{ padding:"9px 12px", fontSize:13, color:"#94a3b8" }}>{r.maxMarks}</td>
                                    <td style={{ padding:"9px 12px" }}><Badge text={gi.grade} color={gc3.text} bg={gc3.bg} /></td>
                                    <td style={{ padding:"9px 12px", fontSize:13, fontWeight:700 }}>{gi.gpa.toFixed(1)}</td>
                                    <td style={{ padding:"9px 12px" }}><Badge text={r.marks>=50?"PASS":"FAIL"} color={r.marks>=50?"#065f46":"#7f1d1d"} bg={r.marks>=50?"#d1fae5":"#fee2e2"} /></td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                    <div style={{ background:"#f8fafc", padding:"16px 32px", borderTop:"1px solid #e2e8f0", display:"flex", justifyContent:"space-between", fontSize:12, color:"#94a3b8" }}>
                      <span>Generated: {new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span>
                      <span>Computer-generated — Delhi Public School</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {tab==="analytics" && (
          <div>
            <div style={{ marginBottom:24 }}>
              <h1 style={{ margin:0, fontSize:24, fontWeight:900 }}>Analytics</h1>
              <p style={{ margin:"3px 0 0", color:"#64748b", fontSize:14 }}>Performance insights across all students and subjects</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              <div style={{ background:"#fff", borderRadius:14, padding:22, border:"1px solid #e2e8f0" }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:18 }}>Subject-wise Average Marks</div>
                {SUBJECTS.slice(0,6).map(sub => {
                  const all = students.flatMap(s => Object.values(academicRecords[s.id]||{}).flatMap(recs=>recs.filter(r=>r.subject===sub).map(r=>r.marks)));
                  const avg = all.length ? Math.round(all.reduce((a,b)=>a+b,0)/all.length) : 0;
                  return (
                    <div key={sub} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:5 }}>
                        <span style={{ color:"#475569" }}>{sub}</span>
                        <span style={{ fontWeight:700 }}>{avg}%</span>
                      </div>
                      <div style={{ background:"#f1f5f9", borderRadius:8, height:8, overflow:"hidden" }}>
                        <div style={{ width:`${avg}%`, height:"100%", borderRadius:8, background:avg>=80?"#10b981":avg>=65?"#6366f1":"#f59e0b" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background:"#fff", borderRadius:14, padding:22, border:"1px solid #e2e8f0" }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:18 }}>Average GPA per Semester</div>
                {SEMESTERS.map(sem => {
                  const gpas = students.map(s=>parseFloat(studentSemGPA(s.id,sem))).filter(g=>g>0);
                  const avg  = gpas.length ? (gpas.reduce((a,b)=>a+b,0)/gpas.length).toFixed(2) : "0.00";
                  const gc   = gpaColor(avg);
                  return (
                    <div key={sem} style={{ marginBottom:16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                        <span style={{ color:"#475569", fontWeight:500 }}>{sem}</span>
                        <span style={{ fontWeight:800, color:gc.text }}>{avg}</span>
                      </div>
                      <div style={{ background:"#f1f5f9", borderRadius:8, height:12, overflow:"hidden" }}>
                        <div style={{ width:`${(parseFloat(avg)/4)*100}%`, height:"100%", borderRadius:8, background:gc.text }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid #f1f5f9" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Pass Rate by Semester</div>
                  {SEMESTERS.map(sem => {
                    const total  = students.length * 6;
                    const passed = students.reduce((acc,s) => acc + ((academicRecords[s.id]||{})[sem]||[]).filter(r=>r.marks>=50).length, 0);
                    const pct    = total ? Math.round((passed/total)*100) : 0;
                    return (
                      <div key={sem} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                        <span style={{ fontSize:12, color:"#64748b", minWidth:100 }}>{sem}</span>
                        <div style={{ flex:1, background:"#f1f5f9", borderRadius:6, height:8, overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%", borderRadius:6, background:"#10b981" }} />
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:"#065f46", minWidth:36 }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              <div style={{ background:"#fff", borderRadius:14, padding:22, border:"1px solid #e2e8f0" }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:16, color:"#065f46" }}>Top 5 Performers</div>
                {[...students].sort((a,b)=>parseFloat(studentGPA(b.id))-parseFloat(studentGPA(a.id))).slice(0,5).map((s,i)=>{
                  const gpa=studentGPA(s.id);
                  return (
                    <div key={s.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<4?"1px solid #f1f5f9":"none" }}>
                      <div style={{ width:22, fontSize:12, fontWeight:700, color:["#f59e0b","#94a3b8","#b45309","#64748b","#64748b"][i] }}>#{i+1}</div>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:"#d1fae5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#065f46" }}>{avatar(s.name)}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{s.name}</div>
                        <div style={{ fontSize:11, color:"#94a3b8" }}>{s.class}</div>
                      </div>
                      <div style={{ fontWeight:800, color:"#065f46", fontSize:14 }}>{gpa}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background:"#fff", borderRadius:14, padding:22, border:"1px solid #e2e8f0" }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:16, color:"#991b1b" }}>Needs Improvement</div>
                {[...students].sort((a,b)=>parseFloat(studentGPA(a.id))-parseFloat(studentGPA(b.id))).slice(0,5).map((s,i)=>{
                  const gpa=studentGPA(s.id);
                  return (
                    <div key={s.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<4?"1px solid #f1f5f9":"none" }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:"#fee2e2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#dc2626" }}>{avatar(s.name)}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{s.name}</div>
                        <div style={{ fontSize:11, color:"#94a3b8" }}>{s.class} · {s.rollNo}</div>
                      </div>
                      <div style={{ fontWeight:800, color:"#dc2626", fontSize:14 }}>{gpa}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Add Student Modal ── */}
        {showAddStudent && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
            <div style={{ background:"#fff", borderRadius:16, padding:28, width:460, maxHeight:"88vh", overflowY:"auto" }}>
              <h3 style={{ margin:"0 0 20px", fontWeight:800, fontSize:18 }}>Add New Student</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[["Full Name","name","text"],["Roll Number","rollNo","text"],["Email","email","email"],["Phone","phone","text"],["Date of Birth","dob","date"],["Address","address","text"]].map(([label,key,type])=>(
                  <div key={key} style={{ gridColumn:["address","name"].includes(key)?"span 2":"span 1" }}>
                    <label style={{ fontSize:11, color:"#64748b", fontWeight:700, display:"block", marginBottom:4, letterSpacing:0.6, textTransform:"uppercase" }}>{label}</label>
                    <input type={type} value={newStudent[key]} onChange={e=>setNewStudent(p=>({...p,[key]:e.target.value}))}
                      style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1.5px solid #e2e8f0", fontSize:14, boxSizing:"border-box" }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize:11, color:"#64748b", fontWeight:700, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:0.6 }}>Class</label>
                  <select value={newStudent.class} onChange={e=>setNewStudent(p=>({...p,class:e.target.value}))} style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1.5px solid #e2e8f0", fontSize:14 }}>
                    {["A","B","A","B"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:11, color:"#64748b", fontWeight:700, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:0.6 }}>Gender</label>
                  <select value={newStudent.gender} onChange={e=>setNewStudent(p=>({...p,gender:e.target.value}))} style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1.5px solid #e2e8f0", fontSize:14 }}>
                    {["Male","Female","Other"].map(g=><option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:22 }}>
                <button onClick={addStudent} style={{ flex:1, background:"#6366f1", color:"#fff", border:"none", borderRadius:10, padding:11, fontWeight:700, fontSize:14, cursor:"pointer" }}>Add Student</button>
                <button onClick={() => setShowAddStudent(false)} style={{ flex:1, background:"#f1f5f9", color:"#475569", border:"none", borderRadius:10, padding:11, fontWeight:600, fontSize:14, cursor:"pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

package com.sarms.seed;

import com.sarms.model.*;
import com.sarms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

/**
 * Seeds all existing frontend mock data into MongoDB on first application start.
 * Only seeds if the users collection is empty (to avoid duplicating data on restart).
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepo;
    private final StudentRepository studentRepo;
    private final FacultyRepository facultyRepo;
    private final DepartmentRepository deptRepo;
    private final CourseRepository courseRepo;
    private final MarksRepository marksRepo;
    private final TimetableSlotRepository timetableRepo;
    private final EnrollmentRepository enrollmentRepo;
    private final AppConfigRepository configRepo;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepo, StudentRepository studentRepo,
                      FacultyRepository facultyRepo, DepartmentRepository deptRepo,
                      CourseRepository courseRepo, MarksRepository marksRepo,
                      TimetableSlotRepository timetableRepo, EnrollmentRepository enrollmentRepo,
                      AppConfigRepository configRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.studentRepo = studentRepo;
        this.facultyRepo = facultyRepo;
        this.deptRepo = deptRepo;
        this.courseRepo = courseRepo;
        this.marksRepo = marksRepo;
        this.timetableRepo = timetableRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.configRepo = configRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) {
            log.info("Database already seeded ({} users present). Skipping.", userRepo.count());
            return;
        }

        log.info("=== Seeding SARMS database ===");
        seedDepartments();
        seedUsers();
        seedStudents();
        seedFaculty();
        seedCourses();
        seedMarks();
        seedTimetable();
        seedEnrollments();
        seedConfig();
        log.info("=== Seeding complete ===");
    }

    // ──────────────────────────── DEPARTMENTS ────────────────────────────

    private void seedDepartments() {
        List<String[]> depts = List.of(
            new String[]{"Computer Science", "CSC"},
            new String[]{"Economics", "ECO"},
            new String[]{"Physics", "PHY"},
            new String[]{"Psychology", "PSY"},
            new String[]{"History", "HIS"},
            new String[]{"Law", "LAW"},
            new String[]{"Environmental Studies", "ENV"},
            new String[]{"Sociology", "SOC"},
            new String[]{"Mathematics", "MAT"}
        );
        for (String[] d : depts) {
            Department dept = new Department();
            dept.setName(d[0]);
            dept.setCode(d[1]);
            deptRepo.save(dept);
        }
        log.info("Seeded {} departments", depts.size());
    }

    // ──────────────────────────── USERS ────────────────────────────

    private void seedUsers() {
        // Students: CS-2022-XXX → STUD-2022-XXX
        String[][] students = {
            {"STUD-2022-001", "pass001", "student", "Aarav Sharma"},
            {"STUD-2022-002", "pass002", "student", "Priya Nair"},
            {"STUD-2022-003", "pass003", "student", "Rohan Mehta"},
            {"STUD-2022-004", "pass004", "student", "Sneha Patel"},
            {"STUD-2022-005", "pass005", "student", "Kiran Verma"},
            {"STUD-2022-006", "pass006", "student", "Anjali Singh"},
            {"STUD-2022-007", "pass007", "student", "Dev Kapoor"},
            {"STUD-2022-008", "pass008", "student", "Meera Joshi"},
            {"STUD-2022-009", "pass009", "student", "Arjun Rao"},
            {"STUD-2022-010", "pass010", "student", "Ishaan Gupta"},
            // 2 extras from credentials.js
            {"STUD-2022-011", "pass011", "student", "Tanvi Desai"},
            {"STUD-2022-012", "pass012", "student", "Rahul Bose"},
        };
        String[][] faculty = {
            {"FAC-001", "fac001", "faculty", "Dr. Pooja Singh"},
            {"FAC-002", "fac002", "faculty", "Prof. Ankit Sharma"},
            {"FAC-003", "fac003", "faculty", "Dr. Vikram Dutta"},
            {"FAC-004", "fac004", "faculty", "Prof. Neha Gupta"},
            {"FAC-005", "fac005", "faculty", "Dr. Ramesh Iyer"},
            {"FAC-006", "fac006", "faculty", "Prof. Sunita Reddy"},
            {"FAC-007", "fac007", "faculty", "Dr. Amit Bansal"},
            {"FAC-008", "fac008", "faculty", "Prof. Kavita Menon"},
            {"FAC-009", "fac009", "faculty", "Dr. Sanjay Kapoor"},
            {"FAC-010", "fac010", "faculty", "Prof. Meenakshi Venkat"},
        };
        String[][] admins = {
            {"ADM-001", "adm001", "admin", "Admin Registrar"},
            {"ADM-002", "adm002", "admin", "Dept. Coordinator"},
            {"ADM-003", "adm003", "admin", "Systems Administrator"},
            {"ADM-004", "adm004", "admin", "IT Support Team"},
            {"ADM-005", "adm005", "admin", "Library Head"},
            {"ADM-006", "adm006", "admin", "Hostel Manager"},
            {"ADM-007", "adm007", "admin", "Finance Controller"},
            {"ADM-008", "adm008", "admin", "Exam Controller"},
            {"ADM-009", "adm009", "admin", "Admissions Head"},
            {"ADM-010", "adm010", "admin", "Security Chief"},
        };

        int count = 0;
        for (String[][] group : new String[][][]{students, faculty, admins}) {
            for (String[] u : group) {
                User user = new User();
                user.setUserId(u[0]);
                user.setPasswordHash(passwordEncoder.encode(u[1]));
                user.setRole(u[2]);
                user.setName(u[3]);
                userRepo.save(user);
                count++;
            }
        }
        log.info("Seeded {} users", count);
    }

    // ──────────────────────────── STUDENTS ────────────────────────────

    private void seedStudents() {
        // Student profiles with academic records (semesters 1-3)
        // Using new STUD-YYYY-NNN format
        List<Student> studs = new ArrayList<>();

        studs.add(makeStudent("STUD-2022-001", "Aarav Sharma", "Ramesh Sharma", "Sunita Sharma",
            "+91 98765 12300", "+91 99887 76655", "12, Green Valley Apartments, Sector 45, Noida, UP - 201301",
            "2004-03-14", "B.Tech Computer Science", 2022, "aarav.sharma@cs.compscience.edu", "O+",
            List.of(
                semRecord(1, 9.1, List.of(cg("CSC101","Mathematics I",4,"A+",10), cg("CSC102","Programming Fundamentals",4,"A",9), cg("CSC103","Digital Logic Design",3,"A+",10))),
                semRecord(2, 8.6, List.of(cg("CSC201","Data Structures",4,"A",9), cg("CSC202","Mathematics II",4,"B+",8), cg("CSC203","Object-Oriented Programming",3,"A+",10))),
                semRecord(3, 8.9, List.of(cg("CSC301","Operating Systems",4,"A",9), cg("CSC302","Design & Analysis of Algorithms",4,"A+",10), cg("CSC303","Computer Networks",3,"A",9)))
            )));

        studs.add(makeStudent("STUD-2022-002", "Priya Nair", "Suresh Nair", "Latha Nair",
            "+91 97654 32100", "+91 99001 12233", "7, Lotus Lane, Koramangala, Bengaluru, KA - 560034",
            "2004-07-22", "B.Tech Computer Science", 2022, "priya.nair@cs.compscience.edu", "B+",
            List.of(
                semRecord(1, 9.5, List.of(cg("CSC101","Mathematics I",4,"A+",10), cg("CSC102","Programming Fundamentals",4,"A+",10), cg("CSC103","Digital Logic Design",3,"A",9))),
                semRecord(2, 9.2, List.of(cg("CSC201","Data Structures",4,"A+",10), cg("CSC202","Mathematics II",4,"A",9), cg("CSC203","Object-Oriented Programming",3,"A+",10))),
                semRecord(3, 9.0, List.of(cg("CSC301","Operating Systems",4,"A",9), cg("CSC302","Design & Analysis of Algorithms",4,"A+",10), cg("CSC303","Computer Networks",3,"A",9)))
            )));

        studs.add(makeStudent("STUD-2022-003", "Rohan Mehta", "Vijay Mehta", "Kavita Mehta",
            "+91 91234 56789", "+91 98111 22333", "34, Shivaji Park, Dadar, Mumbai, MH - 400028",
            "2003-11-05", "B.Tech Computer Science", 2022, "rohan.mehta@cs.compscience.edu", "A+",
            List.of(
                semRecord(1, 7.8, List.of(cg("CSC101","Mathematics I",4,"B+",8), cg("CSC102","Programming Fundamentals",4,"A",9), cg("CSC103","Digital Logic Design",3,"B",7))),
                semRecord(2, 8.0, List.of(cg("CSC201","Data Structures",4,"A",9), cg("CSC202","Mathematics II",4,"B+",8), cg("CSC203","Object-Oriented Programming",3,"B+",8))),
                semRecord(3, 8.2, List.of(cg("CSC301","Operating Systems",4,"A",9), cg("CSC302","Design & Analysis of Algorithms",4,"B+",8), cg("CSC303","Computer Networks",3,"B+",8)))
            )));

        studs.add(makeStudent("STUD-2022-004", "Sneha Patel", "Manoj Patel", "Hema Patel",
            "+91 94567 89012", "+91 97223 44556", "56, Navrangpura, Ahmedabad, GJ - 380009",
            "2004-01-30", "B.Tech Computer Science", 2022, "sneha.patel@cs.compscience.edu", "AB+",
            List.of(
                semRecord(1, 8.5, List.of(cg("CSC101","Mathematics I",4,"A",9), cg("CSC102","Programming Fundamentals",4,"A",9), cg("CSC103","Digital Logic Design",3,"B+",8))),
                semRecord(2, 8.8, List.of(cg("CSC201","Data Structures",4,"A",9), cg("CSC202","Mathematics II",4,"A",9), cg("CSC203","Object-Oriented Programming",3,"A",9))),
                semRecord(3, 8.1, List.of(cg("CSC301","Operating Systems",4,"B+",8), cg("CSC302","Design & Analysis of Algorithms",4,"A",9), cg("CSC303","Computer Networks",3,"B+",8)))
            )));

        studs.add(makeStudent("STUD-2022-005", "Kiran Verma", "Anil Verma", "Asha Verma",
            "+91 99876 54321", "+91 98456 78901", "22, Civil Lines, Jaipur, RJ - 302001",
            "2004-05-18", "B.Tech Computer Science", 2022, "kiran.verma@cs.compscience.edu", "O-",
            List.of(
                semRecord(1, 7.5, List.of(cg("CSC101","Mathematics I",4,"B",7), cg("CSC102","Programming Fundamentals",4,"B+",8), cg("CSC103","Digital Logic Design",3,"B+",8))),
                semRecord(2, 7.2, List.of(cg("CSC201","Data Structures",4,"B+",8), cg("CSC202","Mathematics II",4,"B",7), cg("CSC203","Object-Oriented Programming",3,"B",7))),
                semRecord(3, 7.6, List.of(cg("CSC301","Operating Systems",4,"B+",8), cg("CSC302","Design & Analysis of Algorithms",4,"B",7), cg("CSC303","Computer Networks",3,"B+",8)))
            )));

        studs.add(makeStudent("STUD-2022-006", "Anjali Singh", "Pradeep Singh", "Reena Singh",
            "+91 93456 78901", "+91 99345 67890", "8, Sector 29, Gurgaon, HR - 122001",
            "2004-09-02", "B.Tech Computer Science", 2022, "anjali.singh@cs.compscience.edu", "A-",
            List.of(
                semRecord(1, 8.7, List.of(cg("CSC101","Mathematics I",4,"A",9), cg("CSC102","Programming Fundamentals",4,"A+",10), cg("CSC103","Digital Logic Design",3,"B+",8))),
                semRecord(2, 8.4, List.of(cg("CSC201","Data Structures",4,"A",9), cg("CSC202","Mathematics II",4,"B+",8), cg("CSC203","Object-Oriented Programming",3,"A",9))),
                semRecord(3, 8.7, List.of(cg("CSC301","Operating Systems",4,"A",9), cg("CSC302","Design & Analysis of Algorithms",4,"A",9), cg("CSC303","Computer Networks",3,"B+",8)))
            )));

        studs.add(makeStudent("STUD-2022-007", "Dev Kapoor", "Sunil Kapoor", "Anita Kapoor",
            "+91 96789 01234", "+91 98660 12345", "15, Model Town, Chandigarh, CH - 160017",
            "2003-12-25", "B.Tech Computer Science", 2022, "dev.kapoor@cs.compscience.edu", "B-",
            List.of(
                semRecord(1, 6.8, List.of(cg("CSC101","Mathematics I",4,"B",7), cg("CSC102","Programming Fundamentals",4,"C",6), cg("CSC103","Digital Logic Design",3,"B+",8))),
                semRecord(2, 7.0, List.of(cg("CSC201","Data Structures",4,"B",7), cg("CSC202","Mathematics II",4,"B",7), cg("CSC203","Object-Oriented Programming",3,"B",7))),
                semRecord(3, 7.3, List.of(cg("CSC301","Operating Systems",4,"B+",8), cg("CSC302","Design & Analysis of Algorithms",4,"B",7), cg("CSC303","Computer Networks",3,"B",7)))
            )));

        studs.add(makeStudent("STUD-2022-008", "Meera Joshi", "Prakash Joshi", "Shanti Joshi",
            "+91 98101 23456", "+91 97879 44556", "45, Lakshmi Nagar, New Delhi, DL - 110092",
            "2004-06-08", "B.Tech Computer Science", 2022, "meera.joshi@cs.compscience.edu", "AB-",
            List.of(
                semRecord(1, 9.3, List.of(cg("CSC101","Mathematics I",4,"A+",10), cg("CSC102","Programming Fundamentals",4,"A",9), cg("CSC103","Digital Logic Design",3,"A+",10))),
                semRecord(2, 9.0, List.of(cg("CSC201","Data Structures",4,"A+",10), cg("CSC202","Mathematics II",4,"A",9), cg("CSC203","Object-Oriented Programming",3,"A",9))),
                semRecord(3, 9.1, List.of(cg("CSC301","Operating Systems",4,"A+",10), cg("CSC302","Design & Analysis of Algorithms",4,"A",9), cg("CSC303","Computer Networks",3,"A",9)))
            )));

        studs.add(makeStudent("STUD-2022-009", "Arjun Rao", "Venkatesh Rao", "Padmini Rao",
            "+91 98888 77766", "+91 96543 21098", "22, Jubilee Hills, Hyderabad, TG - 500033",
            "2004-02-14", "B.Tech Computer Science", 2022, "arjun.rao@cs.compscience.edu", "O+",
            List.of(
                semRecord(1, 8.0, List.of(cg("CSC101","Mathematics I",4,"B+",8), cg("CSC102","Programming Fundamentals",4,"A",9), cg("CSC103","Digital Logic Design",3,"B+",8))),
                semRecord(2, 8.3, List.of(cg("CSC201","Data Structures",4,"A",9), cg("CSC202","Mathematics II",4,"B+",8), cg("CSC203","Object-Oriented Programming",3,"A",9))),
                semRecord(3, 8.5, List.of(cg("CSC301","Operating Systems",4,"A",9), cg("CSC302","Design & Analysis of Algorithms",4,"A",9), cg("CSC303","Computer Networks",3,"B+",8)))
            )));

        studs.add(makeStudent("STUD-2022-010", "Ishaan Gupta", "Rajendra Gupta", "Mala Gupta",
            "+91 99012 34567", "+91 98334 55667", "10, Hazratganj, Lucknow, UP - 226001",
            "2004-08-20", "B.Tech Computer Science", 2022, "ishaan.gupta@cs.compscience.edu", "A+",
            List.of(
                semRecord(1, 7.3, List.of(cg("CSC101","Mathematics I",4,"B",7), cg("CSC102","Programming Fundamentals",4,"B+",8), cg("CSC103","Digital Logic Design",3,"B",7))),
                semRecord(2, 7.6, List.of(cg("CSC201","Data Structures",4,"B+",8), cg("CSC202","Mathematics II",4,"B",7), cg("CSC203","Object-Oriented Programming",3,"B+",8))),
                semRecord(3, 7.8, List.of(cg("CSC301","Operating Systems",4,"B+",8), cg("CSC302","Design & Analysis of Algorithms",4,"B+",8), cg("CSC303","Computer Networks",3,"B",7)))
            )));

        // Extra students from credentials.js
        studs.add(makeStudent("STUD-2022-011", "Tanvi Desai", "Hemant Desai", "Nisha Desai",
            "+91 98765 43210", "+91 97654 98765", "5, MG Road, Pune, MH - 411001",
            "2004-04-10", "B.Tech Computer Science", 2022, "tanvi.desai@cs.compscience.edu", "B+",
            List.of(
                semRecord(1, 8.2, List.of(cg("CSC101","Mathematics I",4,"A",9), cg("CSC102","Programming Fundamentals",4,"B+",8), cg("CSC103","Digital Logic Design",3,"B+",8))),
                semRecord(2, 8.0, List.of(cg("CSC201","Data Structures",4,"B+",8), cg("CSC202","Mathematics II",4,"A",9), cg("CSC203","Object-Oriented Programming",3,"B+",8))),
                semRecord(3, 8.4, List.of(cg("CSC301","Operating Systems",4,"A",9), cg("CSC302","Design & Analysis of Algorithms",4,"B+",8), cg("CSC303","Computer Networks",3,"A",9)))
            )));

        studs.add(makeStudent("STUD-2022-012", "Rahul Bose", "Dipak Bose", "Mita Bose",
            "+91 99887 65432", "+91 98765 11223", "12, Salt Lake, Kolkata, WB - 700091",
            "2004-10-15", "B.Tech Computer Science", 2022, "rahul.bose@cs.compscience.edu", "A-",
            List.of(
                semRecord(1, 7.6, List.of(cg("CSC101","Mathematics I",4,"B+",8), cg("CSC102","Programming Fundamentals",4,"B",7), cg("CSC103","Digital Logic Design",3,"B+",8))),
                semRecord(2, 7.8, List.of(cg("CSC201","Data Structures",4,"B+",8), cg("CSC202","Mathematics II",4,"B+",8), cg("CSC203","Object-Oriented Programming",3,"B",7))),
                semRecord(3, 8.0, List.of(cg("CSC301","Operating Systems",4,"B+",8), cg("CSC302","Design & Analysis of Algorithms",4,"A",9), cg("CSC303","Computer Networks",3,"B",7)))
            )));

        studentRepo.saveAll(studs);
        log.info("Seeded {} students", studs.size());
    }

    // ──────────────────────────── FACULTY ────────────────────────────

    private void seedFaculty() {
        Faculty f1 = new Faculty();
        f1.setFacultyId("FAC-001"); f1.setName("Dr. Pooja Singh"); f1.setDesignation("Associate Professor");
        f1.setDepartment("Computer Science"); f1.setEmail("pooja.singh@compscience.edu");
        f1.setPhone("+91 98860 42345"); f1.setSpecialization("Operating Systems & Networks"); f1.setJoinYear(2015);

        Faculty f2 = new Faculty();
        f2.setFacultyId("FAC-002"); f2.setName("Prof. Ankit Sharma"); f2.setDesignation("Assistant Professor");
        f2.setDepartment("Computer Science"); f2.setEmail("ankit.sharma@compscience.edu");
        f2.setPhone("+91 98765 11234"); f2.setSpecialization("Algorithms & Artificial Intelligence"); f2.setJoinYear(2019);

        facultyRepo.saveAll(List.of(f1, f2));
        log.info("Seeded 2 faculty profiles");
    }

    // ──────────────────────────── COURSES ────────────────────────────

    private void seedCourses() {
        List<Course> courses = new ArrayList<>();

        // Semester 1
        courses.add(makeCourse("CSC101","Mathematics I",4,1,"Monsoon",2024,"FAC-003","Dr. Vikram Dutta","Compulsory","core",false,
            "Fundamental mathematical concepts for CS", List.of("Calculus","Linear Algebra","Probability"), List.of()));
        courses.add(makeCourse("CSC102","Programming Fundamentals",4,1,"Monsoon",2024,"FAC-002","Prof. Ankit Sharma","Compulsory","core",false,
            "Introduction to programming concepts", List.of("Variables","Loops","Functions","Arrays"), List.of()));
        courses.add(makeCourse("CSC103","Digital Logic Design",3,1,"Monsoon",2024,"FAC-001","Dr. Pooja Singh","Compulsory","core",false,
            "Boolean algebra and digital circuits", List.of("Logic Gates","Flip-flops","Counters"), List.of()));

        // Semester 2
        courses.add(makeCourse("CSC201","Data Structures",4,2,"Spring",2025,"FAC-002","Prof. Ankit Sharma","Compulsory","core",false,
            "Linear and non-linear data structures", List.of("Arrays","Trees","Graphs","Hashing"), List.of()));
        courses.add(makeCourse("CSC202","Mathematics II",4,2,"Spring",2025,"FAC-003","Dr. Vikram Dutta","Compulsory","core",false,
            "Advanced mathematical methods", List.of("Discrete Math","Statistics","Number Theory"), List.of()));
        courses.add(makeCourse("CSC203","Object-Oriented Programming",3,2,"Spring",2025,"FAC-001","Dr. Pooja Singh","Compulsory","core",false,
            "OOP paradigm and design patterns", List.of("Encapsulation","Inheritance","Polymorphism"), List.of()));

        // Semester 3
        courses.add(makeCourse("CSC301","Operating Systems",4,3,"Monsoon",2025,"FAC-001","Dr. Pooja Singh","Compulsory","core",false,
            "Process management and memory systems", List.of("Scheduling","Memory","File Systems","Deadlocks"), List.of()));
        courses.add(makeCourse("CSC302","Design & Analysis of Algorithms",4,3,"Monsoon",2025,"FAC-002","Prof. Ankit Sharma","Compulsory","core",false,
            "Algorithm design paradigms", List.of("Divide & Conquer","DP","Greedy","Graph Algorithms"), List.of()));
        courses.add(makeCourse("CSC303","Computer Networks",3,3,"Monsoon",2025,"FAC-001","Dr. Pooja Singh","Compulsory","core",false,
            "Networking fundamentals", List.of("OSI Model","TCP/IP","Routing","Sockets"), List.of()));

        // Semester 4 (Active semester)
        courses.add(makeCourse("CSC401","Database Management Systems",4,4,"Spring",2026,"FAC-001","Dr. Pooja Singh","Compulsory","core",true,
            "Relational databases and SQL", List.of("ER Modeling","Normalization","SQL","Transactions","Indexing"),
            List.of(gc("comp1","Assignments",20), gc("comp2","Quiz",15), gc("comp3","Midsem",30), gc("comp4","Endsem",35))));
        courses.add(makeCourse("CSC402","Software Engineering",4,4,"Spring",2026,"FAC-002","Prof. Ankit Sharma","Compulsory","core",true,
            "Software development lifecycle", List.of("Agile","UML","Testing","CI/CD","Design Patterns"),
            List.of(gc("comp1","Assignments",20), gc("comp2","Quiz",10), gc("comp3","Midsem",30), gc("comp4","Endsem",40))));
        courses.add(makeCourse("CSC403","Artificial Intelligence",4,4,"Spring",2026,"FAC-002","Prof. Ankit Sharma","Compulsory","core",true,
            "Introduction to AI techniques", List.of("Search","ML Basics","Neural Networks","NLP"),
            List.of(gc("comp1","Assignments",25), gc("comp2","Quiz",10), gc("comp3","Midsem",25), gc("comp4","Endsem",40))));
        courses.add(makeCourse("CSC404","Web Development",4,4,"Spring",2026,"FAC-001","Dr. Pooja Singh","Elective","majorElective",true,
            "Modern web development", List.of("HTML/CSS","JavaScript","React","Node.js","REST APIs"),
            List.of(gc("comp1","Project",30), gc("comp2","Quiz",10), gc("comp3","Midsem",20), gc("comp4","Endsem",40))));
        courses.add(makeCourse("CSC405","Machine Learning",4,4,"Spring",2026,"FAC-002","Prof. Ankit Sharma","Elective","majorElective",true,
            "Statistical learning methods", List.of("Regression","Classification","Clustering","Deep Learning"),
            List.of(gc("comp1","Assignments",20), gc("comp2","Project",20), gc("comp3","Midsem",25), gc("comp4","Endsem",35))));

        // UWE
        courses.add(makeCourse("ECO201","Microeconomics",3,4,"Spring",2026,"FAC-004","Prof. Neha Gupta","Elective","uwe",true,
            "Economic decision-making", List.of("Supply & Demand","Market Structures"), List.of()));
        courses.add(makeCourse("PHY101","Introduction to Astrophysics",3,4,"Spring",2026,"FAC-005","Dr. Ramesh Iyer","Elective","uwe",true,
            "Exploring the cosmos", List.of("Stellar Evolution","Cosmology"), List.of()));
        courses.add(makeCourse("PSY101","Cognitive Psychology",3,4,"Spring",2026,"FAC-006","Prof. Sunita Reddy","Elective","uwe",true,
            "How the mind works", List.of("Memory","Perception","Attention"), List.of()));

        // CCC
        courses.add(makeCourse("HIS101","Indian History",1.5,4,"Spring",2026,"FAC-007","Dr. Amit Bansal","Elective","ccc",true,
            "Indian history overview", List.of("Ancient India","Medieval Period","Modern India"), List.of()));
        courses.add(makeCourse("LAW101","Constitution of India",1.5,4,"Spring",2026,"FAC-008","Prof. Kavita Menon","Elective","ccc",true,
            "Legal framework of India", List.of("Fundamental Rights","Directive Principles"), List.of()));
        courses.add(makeCourse("ENV101","Environmental Science",1.5,4,"Spring",2026,"FAC-009","Dr. Sanjay Kapoor","Elective","ccc",true,
            "Environmental awareness", List.of("Biodiversity","Pollution","Climate Change"), List.of()));

        courseRepo.saveAll(courses);
        log.info("Seeded {} courses", courses.size());
    }

    // ──────────────────────────── MARKS ────────────────────────────

    private void seedMarks() {
        // Marks data for semester 4 active courses
        String[] rollNos = {
            "STUD-2022-001","STUD-2022-002","STUD-2022-003","STUD-2022-004","STUD-2022-005",
            "STUD-2022-006","STUD-2022-007","STUD-2022-008","STUD-2022-009","STUD-2022-010",
            "STUD-2022-011","STUD-2022-012"
        };
        String[] names = {
            "Aarav Sharma","Priya Nair","Rohan Mehta","Sneha Patel","Kiran Verma",
            "Anjali Singh","Dev Kapoor","Meera Joshi","Arjun Rao","Ishaan Gupta",
            "Tanvi Desai","Rahul Bose"
        };

        // CSC401 marks
        Marks m1 = new Marks();
        m1.setCourseCode("CSC401"); m1.setCourseName("Database Management Systems"); m1.setSemester(4); m1.setActiveSemester(true);
        m1.setGradingComponents(List.of(gc("comp1","Assignments",20), gc("comp2","Quiz",15), gc("comp3","Midsem",30), gc("comp4","Endsem",35)));
        m1.setStudentMarks(List.of(
            sm(rollNos[0],names[0], Map.of("comp1",18.0,"comp2",12.0,"comp3",27.0,"comp4",31.0)),
            sm(rollNos[1],names[1], Map.of("comp1",20.0,"comp2",14.0,"comp3",28.0,"comp4",33.0)),
            sm(rollNos[2],names[2], Map.of("comp1",15.0,"comp2",10.0,"comp3",22.0,"comp4",25.0)),
            sm(rollNos[3],names[3], Map.of("comp1",17.0,"comp2",12.0,"comp3",25.0,"comp4",30.0)),
            sm(rollNos[4],names[4], Map.of("comp1",12.0,"comp2",8.0,"comp3",18.0,"comp4",22.0)),
            sm(rollNos[5],names[5], Map.of("comp1",19.0,"comp2",13.0,"comp3",26.0,"comp4",32.0)),
            sm(rollNos[6],names[6], Map.of("comp1",10.0,"comp2",7.0,"comp3",15.0,"comp4",20.0)),
            sm(rollNos[7],names[7], Map.of("comp1",20.0,"comp2",15.0,"comp3",29.0,"comp4",34.0)),
            sm(rollNos[8],names[8], Map.of("comp1",16.0,"comp2",11.0,"comp3",24.0,"comp4",28.0)),
            sm(rollNos[9],names[9], Map.of("comp1",14.0,"comp2",9.0,"comp3",20.0,"comp4",24.0)),
            sm(rollNos[10],names[10], Map.of("comp1",17.0,"comp2",11.0,"comp3",23.0,"comp4",29.0)),
            sm(rollNos[11],names[11], Map.of("comp1",13.0,"comp2",9.0,"comp3",19.0,"comp4",23.0))
        ));

        // CSC402 marks
        Marks m2 = new Marks();
        m2.setCourseCode("CSC402"); m2.setCourseName("Software Engineering"); m2.setSemester(4); m2.setActiveSemester(true);
        m2.setGradingComponents(List.of(gc("comp1","Assignments",20), gc("comp2","Quiz",10), gc("comp3","Midsem",30), gc("comp4","Endsem",40)));
        m2.setStudentMarks(List.of(
            sm(rollNos[0],names[0], Map.of("comp1",17.0,"comp2",8.0,"comp3",26.0,"comp4",35.0)),
            sm(rollNos[1],names[1], Map.of("comp1",19.0,"comp2",9.0,"comp3",28.0,"comp4",37.0)),
            sm(rollNos[2],names[2], Map.of("comp1",14.0,"comp2",6.0,"comp3",20.0,"comp4",28.0)),
            sm(rollNos[3],names[3], Map.of("comp1",16.0,"comp2",8.0,"comp3",24.0,"comp4",32.0)),
            sm(rollNos[4],names[4], Map.of("comp1",11.0,"comp2",5.0,"comp3",16.0,"comp4",24.0)),
            sm(rollNos[5],names[5], Map.of("comp1",18.0,"comp2",9.0,"comp3",27.0,"comp4",36.0)),
            sm(rollNos[6],names[6], Map.of("comp1",9.0,"comp2",4.0,"comp3",13.0,"comp4",18.0)),
            sm(rollNos[7],names[7], Map.of("comp1",20.0,"comp2",10.0,"comp3",29.0,"comp4",38.0)),
            sm(rollNos[8],names[8], Map.of("comp1",15.0,"comp2",7.0,"comp3",22.0,"comp4",30.0)),
            sm(rollNos[9],names[9], Map.of("comp1",12.0,"comp2",6.0,"comp3",18.0,"comp4",26.0)),
            sm(rollNos[10],names[10], Map.of("comp1",16.0,"comp2",7.0,"comp3",22.0,"comp4",31.0)),
            sm(rollNos[11],names[11], Map.of("comp1",13.0,"comp2",6.0,"comp3",17.0,"comp4",25.0))
        ));

        // CSC403 marks
        Marks m3 = new Marks();
        m3.setCourseCode("CSC403"); m3.setCourseName("Artificial Intelligence"); m3.setSemester(4); m3.setActiveSemester(true);
        m3.setGradingComponents(List.of(gc("comp1","Assignments",25), gc("comp2","Quiz",10), gc("comp3","Midsem",25), gc("comp4","Endsem",40)));
        m3.setStudentMarks(List.of(
            sm(rollNos[0],names[0], Map.of("comp1",22.0,"comp2",9.0,"comp3",22.0,"comp4",35.0)),
            sm(rollNos[1],names[1], Map.of("comp1",24.0,"comp2",10.0,"comp3",24.0,"comp4",38.0)),
            sm(rollNos[2],names[2], Map.of("comp1",17.0,"comp2",6.0,"comp3",17.0,"comp4",27.0)),
            sm(rollNos[3],names[3], Map.of("comp1",20.0,"comp2",8.0,"comp3",20.0,"comp4",32.0)),
            sm(rollNos[4],names[4], Map.of("comp1",14.0,"comp2",5.0,"comp3",14.0,"comp4",22.0)),
            sm(rollNos[5],names[5], Map.of("comp1",23.0,"comp2",9.0,"comp3",23.0,"comp4",36.0)),
            sm(rollNos[6],names[6], Map.of("comp1",11.0,"comp2",4.0,"comp3",11.0,"comp4",18.0)),
            sm(rollNos[7],names[7], Map.of("comp1",25.0,"comp2",10.0,"comp3",25.0,"comp4",39.0)),
            sm(rollNos[8],names[8], Map.of("comp1",19.0,"comp2",7.0,"comp3",19.0,"comp4",30.0)),
            sm(rollNos[9],names[9], Map.of("comp1",15.0,"comp2",6.0,"comp3",15.0,"comp4",24.0)),
            sm(rollNos[10],names[10], Map.of("comp1",19.0,"comp2",7.0,"comp3",18.0,"comp4",30.0)),
            sm(rollNos[11],names[11], Map.of("comp1",14.0,"comp2",5.0,"comp3",15.0,"comp4",23.0))
        ));

        // CSC301 marks (Past semester - locked)
        Marks m4 = new Marks();
        m4.setCourseCode("CSC301"); m4.setCourseName("Operating Systems"); m4.setSemester(3); m4.setActiveSemester(false);
        m4.setGradingComponents(List.of(gc("comp1","Assignments",20), gc("comp2","Quiz",15), gc("comp3","Midsem",25), gc("comp4","Endsem",40)));
        m4.setStudentMarks(List.of(
            sm(rollNos[0],names[0], Map.of("comp1",18.0,"comp2",13.0,"comp3",22.0,"comp4",36.0)),
            sm(rollNos[1],names[1], Map.of("comp1",19.0,"comp2",14.0,"comp3",23.0,"comp4",35.0)),
            sm(rollNos[2],names[2], Map.of("comp1",17.0,"comp2",11.0,"comp3",20.0,"comp4",34.0)),
            sm(rollNos[3],names[3], Map.of("comp1",15.0,"comp2",10.0,"comp3",18.0,"comp4",30.0)),
            sm(rollNos[4],names[4], Map.of("comp1",14.0,"comp2",10.0,"comp3",16.0,"comp4",28.0))
        ));

        // CSC302 marks (Past semester - locked)
        Marks m5 = new Marks();
        m5.setCourseCode("CSC302"); m5.setCourseName("Design & Analysis of Algorithms"); m5.setSemester(3); m5.setActiveSemester(false);
        m5.setGradingComponents(List.of(gc("comp1","Assignments",25), gc("comp2","Quiz",10), gc("comp3","Midsem",25), gc("comp4","Endsem",40)));
        m5.setStudentMarks(List.of(
            sm(rollNos[0],names[0], Map.of("comp1",23.0,"comp2",9.0,"comp3",23.0,"comp4",37.0)),
            sm(rollNos[1],names[1], Map.of("comp1",24.0,"comp2",10.0,"comp3",24.0,"comp4",38.0)),
            sm(rollNos[2],names[2], Map.of("comp1",18.0,"comp2",7.0,"comp3",18.0,"comp4",30.0)),
            sm(rollNos[3],names[3], Map.of("comp1",20.0,"comp2",8.0,"comp3",21.0,"comp4",34.0)),
            sm(rollNos[4],names[4], Map.of("comp1",15.0,"comp2",6.0,"comp3",15.0,"comp4",26.0))
        ));

        marksRepo.saveAll(List.of(m1, m2, m3, m4, m5));
        log.info("Seeded marks for 5 courses");
    }

    // ──────────────────────────── TIMETABLE ────────────────────────────

    private void seedTimetable() {
        List<TimetableSlot> slots = List.of(
            makeTimetableSlot("CSC401","Database Management Systems","Lecture","LH-301","Dr. Pooja Singh",List.of(0,2),9,10,"bg-blue-100 border-blue-400 text-blue-900"),
            makeTimetableSlot("CSC401","Database Management Systems","Lab","DB-Lab","Dr. Pooja Singh",List.of(4),14,16,"bg-blue-100 border-blue-400 text-blue-900"),
            makeTimetableSlot("CSC402","Software Engineering","Lecture","LH-205","Prof. Ankit Sharma",List.of(1,3),10,11,"bg-emerald-100 border-emerald-400 text-emerald-900"),
            makeTimetableSlot("CSC403","Artificial Intelligence","Lecture","LH-104","Prof. Ankit Sharma",List.of(0,3),11,12,"bg-purple-100 border-purple-400 text-purple-900"),
            makeTimetableSlot("CSC403","Artificial Intelligence","Lab","AI-Lab","Prof. Ankit Sharma",List.of(2),15,17,"bg-purple-100 border-purple-400 text-purple-900"),
            makeTimetableSlot("CSC404","Web Development","Lecture","LH-202","Dr. Pooja Singh",List.of(1,5),13,14,"bg-amber-100 border-amber-400 text-amber-900"),
            makeTimetableSlot("CSC404","Web Development","Lab","CS-Lab-2","Dr. Pooja Singh",List.of(5),10,12,"bg-amber-100 border-amber-400 text-amber-900"),
            makeTimetableSlot("CSC402","Software Engineering","Tutorial","LH-107","Prof. Ankit Sharma",List.of(4),9,10,"bg-emerald-100 border-emerald-400 text-emerald-900")
        );
        timetableRepo.saveAll(slots);
        log.info("Seeded {} timetable slots", slots.size());
    }

    // ──────────────────────────── ENROLLMENTS ────────────────────────────

    private void seedEnrollments() {
        // Enroll all 12 students in sem-4 core courses
        String[] rollNos = {
            "STUD-2022-001","STUD-2022-002","STUD-2022-003","STUD-2022-004","STUD-2022-005",
            "STUD-2022-006","STUD-2022-007","STUD-2022-008","STUD-2022-009","STUD-2022-010",
            "STUD-2022-011","STUD-2022-012"
        };
        String[] coreCourses = {"CSC401","CSC402","CSC403"};

        List<Enrollment> enrollments = new ArrayList<>();
        for (String rollNo : rollNos) {
            for (String code : coreCourses) {
                Enrollment e = new Enrollment();
                e.setRollNo(rollNo);
                e.setCourseCode(code);
                e.setSemester(4);
                e.setConfirmed(true);
                e.setEnrolledAt(Instant.now());
                enrollments.add(e);
            }
            // Add an elective for the first student (CSC404)
            if (rollNo.equals("STUD-2022-001")) {
                Enrollment e = new Enrollment();
                e.setRollNo(rollNo);
                e.setCourseCode("CSC404");
                e.setSemester(4);
                e.setConfirmed(true);
                e.setEnrolledAt(Instant.now());
                enrollments.add(e);
            }
        }
        enrollmentRepo.saveAll(enrollments);
        log.info("Seeded {} enrollments", enrollments.size());
    }

    // ──────────────────────────── CONFIG ────────────────────────────

    private void seedConfig() {
        AppConfig cs = new AppConfig();
        cs.setKey("currentSemester");
        cs.setValue(Map.of("type", "Spring", "year", 2026, "number", 4));
        configRepo.save(cs);

        AppConfig un = new AppConfig();
        un.setKey("universityName");
        un.setValue("MRCA University");
        configRepo.save(un);

        AppConfig mc = new AppConfig();
        mc.setKey("maxCredits");
        mc.setValue(25);
        configRepo.save(mc);

        log.info("Seeded 3 config entries");
    }

    // ──────────────────────────── Helpers ────────────────────────────

    private Student makeStudent(String rollNo, String name, String fatherName, String motherName,
                                 String guardianPhone, String personalPhone, String address,
                                 String dob, String program, int batchYear, String email, String bloodGroup,
                                 List<Student.SemesterRecord> academicRecord) {
        Student s = new Student();
        s.setRollNo(rollNo); s.setName(name); s.setFatherName(fatherName); s.setMotherName(motherName);
        s.setGuardianPhone(guardianPhone); s.setPersonalPhone(personalPhone); s.setAddress(address);
        s.setDob(LocalDate.parse(dob)); s.setProgram(program); s.setBatchYear(batchYear);
        s.setEmail(email); s.setBloodGroup(bloodGroup); s.setAcademicRecord(academicRecord);
        return s;
    }

    private Student.SemesterRecord semRecord(int sem, double sgpa, List<Student.CourseGrade> courses) {
        return new Student.SemesterRecord(sem, sgpa, courses);
    }

    private Student.CourseGrade cg(String code, String name, double credits, String grade, int gp) {
        return new Student.CourseGrade(code, name, credits, grade, gp);
    }

    private Course makeCourse(String code, String name, double credits, int semester, String semType, int year,
                               String facId, String facName, String type, String category, boolean active,
                               String desc, List<String> topics, List<Course.GradingComponent> components) {
        Course c = new Course();
        c.setCode(code); c.setName(name); c.setCredits(credits); c.setSemester(semester);
        c.setSemesterType(semType); c.setYear(year); c.setFacultyId(facId); c.setFacultyName(facName);
        c.setType(type); c.setCategory(category); c.setActiveSemester(active);
        c.setDepartment("Computer Science"); c.setDepartmentCode("CSC");
        c.setDescription(desc); c.setSyllabusTopics(new ArrayList<>(topics));
        c.setGradedComponents(new ArrayList<>(components));
        c.setEnrolled(active ? 12 : 0);
        c.setStatus(active ? "Active" : "Active"); // all courses are active for seed
        c.setResultsPublished(!active); // past semesters are published
        return c;
    }

    private Course.GradingComponent gc(String id, String name, int weight) {
        return new Course.GradingComponent(id, name, weight);
    }

    private Marks.StudentMark sm(String rollNo, String name, Map<String, Double> marks) {
        return new Marks.StudentMark(rollNo, name, new HashMap<>(marks));
    }

    private TimetableSlot makeTimetableSlot(String code, String name, String type, String room,
                                             String faculty, List<Integer> days, int start, int end, String color) {
        TimetableSlot s = new TimetableSlot();
        s.setCourseCode(code); s.setCourseName(name); s.setType(type); s.setRoom(room);
        s.setFacultyName(faculty); s.setDays(days); s.setStartHour(start); s.setEndHour(end); s.setColorClass(color);
        return s;
    }
}

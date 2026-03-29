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
import java.util.stream.Collectors;

/**
 * Seeds SARMS database with structural changes requested.
 * Flushes all collections except admin users and re-seeds faculty, departments, and core courses.
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
        log.info("=== Starting Structural Database Overhaul ===");
        
        flushDatabase();
        
        seedDepartments();
        seedFaculty();
        seedCoreCourses();
        seedConfig();
        
        log.info("=== Structural Overhaul Complete ===");
    }

    private void flushDatabase() {
        log.info("Flushing database (keeping admin users)...");
        
        // Delete non-admin users
        List<User> nonAdmins = userRepo.findAll().stream()
                .filter(u -> !"admin".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());
        userRepo.deleteAll(nonAdmins);
        log.info("Deleted {} non-admin users.", nonAdmins.size());

        studentRepo.deleteAll();
        facultyRepo.deleteAll();
        deptRepo.deleteAll();
        courseRepo.deleteAll();
        marksRepo.deleteAll();
        timetableRepo.deleteAll();
        enrollmentRepo.deleteAll();
        // Keep config if it exists, or re-seed it
        log.info("All relevant collections flushed.");
    }

    private void seedDepartments() {
        List<String[]> depts = List.of(
            new String[]{"BTech - CSE", "CSE"},
            new String[]{"BTech - ECE", "ECE"},
            new String[]{"BTech - ME", "ME"},
            new String[]{"BTech - CE", "CE"}
        );
        for (String[] d : depts) {
            Department dept = new Department();
            dept.setName(d[0]);
            dept.setCode(d[1]);
            deptRepo.save(dept);
        }
        log.info("Seeded 4 departments: CSE, ECE, ME, CE");
    }

    private void seedFaculty() {
        Map<String, List<String>> names = Map.of(
            "CSE", List.of("Dr. Alan Turing", "Dr. Ada Lovelace", "Dr. Grace Hopper", "Dr. John von Neumann", "Dr. Claude Shannon"),
            "ECE", List.of("Dr. Nikola Tesla", "Dr. Guglielmo Marconi", "Dr. James Maxwell", "Dr. Heinrich Hertz", "Dr. Michael Faraday"),
            "ME", List.of("Dr. James Watt", "Dr. Rudolf Diesel", "Dr. Henry Ford", "Dr. Wright Brothers", "Dr. Isambard Brunel"),
            "CE", List.of("Dr. Marie Curie", "Dr. Antoine Lavoisier", "Dr. Linus Pauling", "Dr. Dmitri Mendeleev", "Dr. Robert Boyle")
        );

        int count = 1;
        for (Map.Entry<String, List<String>> entry : names.entrySet()) {
            String deptCode = entry.getKey();
            String deptName = "BTech - " + deptCode;
            for (String name : entry.getValue()) {
                String facId = String.format("FAC-%s-%03d", deptCode, count++);
                Faculty f = new Faculty();
                f.setFacultyId(facId);
                f.setName(name);
                f.setDepartment(deptName);
                f.setDesignation("Professor");
                f.setEmail(name.toLowerCase().replace("dr. ", "").replace(" ", ".") + "@mrca.edu");
                f.setPhone("+91 90000 " + (10000 + count));
                f.setSpecialization(deptCode + " Specialist");
                f.setJoinYear(2020);
                facultyRepo.save(f);

                // Create User account for faculty
                User u = new User();
                u.setUserId(facId);
                u.setPasswordHash(passwordEncoder.encode("password123"));
                u.setRole("faculty");
                u.setName(name);
                userRepo.save(u);
            }
        }
        log.info("Seeded 5 faculty members per department.");
    }

    private void seedCoreCourses() {
        List<Department> departments = deptRepo.findAll();
        for (Department dept : departments) {
            List<Faculty> deptFaculty = facultyRepo.findAll().stream()
                    .filter(f -> f.getDepartment().equals(dept.getName()))
                    .collect(Collectors.toList());
            
            Random rand = new Random();
            for (int sem = 1; sem <= 8; sem++) {
                for (int cNum = 1; cNum <= 3; cNum++) {
                    String courseCode = String.format("%s%d%02d", dept.getCode(), sem, cNum);
                    String courseName = String.format("%s Core %d (Sem %d)", dept.getCode(), cNum, sem);
                    Faculty fac = deptFaculty.get(rand.nextInt(deptFaculty.size()));
                    
                    Course c = new Course();
                    c.setCode(courseCode);
                    c.setName(courseName);
                    c.setCredits(4.0);
                    c.setSemester(sem);
                    c.setSemesterType(sem % 2 == 0 ? "Spring" : "Monsoon");
                    c.setYear(2026 - (sem / 2)); // rough estimate
                    c.setFacultyId(fac.getFacultyId());
                    c.setFacultyName(fac.getName());
                    c.setType("Compulsory");
                    c.setCategory("core");
                    c.setActiveSemester(sem == 4); // Set sem 4 as active for demonstration
                    c.setDepartment(dept.getName());
                    c.setDepartmentCode(dept.getCode());
                    c.setDescription(String.format("Advanced core course for %s students.", dept.getName()));
                    c.setSyllabusTopics(new ArrayList<>(List.of("Foundation", "Core Concepts", "Advanced Applications")));
                    c.setGradedComponents(new ArrayList<>(List.of(
                        new Course.GradingComponent("comp1", "Assignments", 20),
                        new Course.GradingComponent("comp2", "Midsem", 30),
                        new Course.GradingComponent("comp3", "Endsem", 50)
                    )));
                    c.setEnrolled(0);
                    c.setStatus("Active");
                    c.setResultsPublished(sem < 4);
                    courseRepo.save(c);
                }
            }
        }
        log.info("Seeded 3 core courses per department per semester (Total 96 courses).");
    }

    private void seedConfig() {
        if (configRepo.count() > 0) return;
        
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
        log.info("Seeded application configuration.");
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

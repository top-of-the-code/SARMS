package com.sarms.service;

import com.sarms.model.AppConfig;
import com.sarms.model.Course;
import com.sarms.model.Student;
import com.sarms.repository.AppConfigRepository;
import com.sarms.repository.CourseRepository;
import com.sarms.repository.EnrollmentRepository;
import com.sarms.repository.MarksRepository;
import com.sarms.repository.StudentRepository;
import com.sarms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final AppConfigRepository appConfigRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseService courseService;
    private final MarksService marksService;
    private final MarksRepository marksRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public AdminService(AppConfigRepository appConfigRepository,
                        EnrollmentRepository enrollmentRepository,
                        StudentRepository studentRepository,
                        CourseService courseService,
                        MarksService marksService,
                        MarksRepository marksRepository,
                        UserRepository userRepository,
                        CourseRepository courseRepository) {
        this.appConfigRepository = appConfigRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseService = courseService;
        this.marksService = marksService;
        this.marksRepository = marksRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public Map<String, Object> setActiveTerm(String term, int year) {
        if (term == null || term.isBlank()) {
            throw new IllegalArgumentException("term is required");
        }
        String t = term.trim();
        String type;
        if (t.equalsIgnoreCase("Spring")) {
            type = "Spring";
        } else if (t.equalsIgnoreCase("Monsoon")) {
            type = "Monsoon";
        } else {
            throw new IllegalArgumentException("term must be Spring or Monsoon");
        }

        AppConfig cfg = appConfigRepository.findByKey("currentSemester")
                .orElseThrow(() -> new IllegalStateException("currentSemester config not found"));

        Map<String, Object> map = new LinkedHashMap<>();
        Object val = cfg.getValue();
        if (val instanceof Map<?, ?> existing) {
            for (Map.Entry<?, ?> e : existing.entrySet()) {
                map.put(String.valueOf(e.getKey()), e.getValue());
            }
        }
        map.put("type", type);
        map.put("year", year);

        // Academic semester index (1–8): odd for Monsoon, even for Spring — snap from previous value when possible.
        int prevNum = 1;
        Object numObj = map.get("number");
        if (numObj instanceof Number n) {
            prevNum = Math.max(1, Math.min(8, n.intValue()));
        }
        int newNum;
        if ("Monsoon".equals(type)) {
            newNum = (prevNum % 2 != 0) ? prevNum : Math.max(1, prevNum - 1);
        } else {
            newNum = (prevNum % 2 == 0) ? prevNum : Math.min(8, prevNum + 1);
        }
        map.put("number", newNum);

        cfg.setValue(map);
        appConfigRepository.save(cfg);

        return Map.of("ok", true, "currentSemester", map);
    }

    /**
     * Clears all enrollment rows and removes the configured academic semester (currentSemester.number)
     * from every student's transcript, reversing course enrollment counts and marks roster entries where possible.
     */
    public Map<String, Object> resetCurrentTermRegistrations() {
        AppConfig cfg = appConfigRepository.findByKey("currentSemester")
                .orElseThrow(() -> new IllegalStateException("currentSemester config not found"));

        int semNum = 1;
        Object val = cfg.getValue();
        if (val instanceof Map<?, ?> m && m.get("number") instanceof Number n) {
            semNum = n.intValue();
        }
        final int finalSemNum = semNum;

        long enrollmentCount = enrollmentRepository.count();
        enrollmentRepository.deleteAll();

        int studentsTouched = 0;
        List<Student> students = studentRepository.findAll();
        for (Student s : students) {
            if (s.getAcademicRecord() == null) {
                continue;
            }
            var records = s.getAcademicRecord();
            var toClear = records.stream().filter(r -> r.getSemester() == finalSemNum).findFirst();
            if (toClear.isEmpty()) {
                continue;
            }
            Student.SemesterRecord rec = toClear.get();
            if (rec.getCourses() != null) {
                for (Student.CourseGrade cg : rec.getCourses()) {
                    if (cg.getCourseCode() == null) {
                        continue;
                    }
                    try {
                        courseService.decrementEnrollment(cg.getCourseCode());
                    } catch (RuntimeException ignored) {
                        // course may have been removed
                    }
                    marksService.removeStudentFromCourseRoster(cg.getCourseCode(), s.getRollNo());
                }
            }
            records.removeIf(r -> r.getSemester() == finalSemNum);
            studentRepository.save(s);
            studentsTouched++;
        }

        return Map.of(
                "message", "Registrations reset for semester " + semNum,
                "semester", semNum,
                "enrollmentsRemoved", enrollmentCount,
                "studentsUpdated", studentsTouched
        );
    }

    /**
     * Full system reset (Change 12):
     * Deletes ALL students, enrollments, marks, and student user accounts.
     * Preserves courses, faculty, departments, and admin accounts.
     * Resets term to Monsoon 2025.
     */
    public Map<String, Object> fullSystemReset() {
        long studentsDeleted = studentRepository.count();
        long enrollmentsDeleted = enrollmentRepository.count();
        long marksDeleted = marksRepository.count();

        studentRepository.deleteAll();
        enrollmentRepository.deleteAll();
        marksRepository.deleteAll();
        userRepository.deleteByRole("student");

        // Reset all course enrollment counts to 0 and reactivate
        List<Course> allCourses = courseRepository.findAll();
        for (Course course : allCourses) {
            course.setEnrolled(0);
            course.setResultsPublished(false);
            course.setActiveSemester(true);
            courseRepository.save(course);
        }

        // Reset term config to Monsoon 2025
        AppConfig cfg = appConfigRepository.findByKey("currentSemester")
                .orElse(null);
        if (cfg != null) {
            Map<String, Object> termMap = new LinkedHashMap<>();
            termMap.put("type", "Monsoon");
            termMap.put("year", 2025);
            termMap.put("number", 1);
            cfg.setValue(termMap);
            appConfigRepository.save(cfg);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("message", "Full system reset complete. Term set to Monsoon 2025.");
        result.put("studentsDeleted", studentsDeleted);
        result.put("enrollmentsDeleted", enrollmentsDeleted);
        result.put("marksDeleted", marksDeleted);
        return result;
    }
}

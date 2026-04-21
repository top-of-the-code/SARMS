package com.sarms.service;

import com.sarms.model.AppConfig;
import com.sarms.model.Course;
import com.sarms.model.Marks;
import com.sarms.model.Student;
import com.sarms.repository.AppConfigRepository;
import com.sarms.repository.CourseRepository;
import com.sarms.repository.MarksRepository;
import com.sarms.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final MarksService marksService;
    private final AppConfigRepository appConfigRepository;

    public CourseService(CourseRepository courseRepository,
                         MarksRepository marksRepository,
                         StudentRepository studentRepository,
                         MarksService marksService,
                         AppConfigRepository appConfigRepository) {
        this.courseRepository = courseRepository;
        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;
        this.marksService = marksService;
        this.appConfigRepository = appConfigRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getByCode(String code) {
        return courseRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Course not found: " + code));
    }

    public List<Course> getBySemester(int semester) {
        return courseRepository.findBySemester(semester);
    }

    public List<Course> getByFacultyId(String facultyId) {
        return courseRepository.findByFacultyId(facultyId);
    }

    private void validateSemesterRules(Course course) {
        if (course.getSemesterType() == null || (!course.getSemesterType().equals("Spring") && !course.getSemesterType().equals("Monsoon") && !course.getSemesterType().equals("Both"))) {
            throw new RuntimeException("Invalid semester type. Must be Spring, Monsoon, or Both.");
        }
        if (!"ccc".equalsIgnoreCase(course.getCategory()) && !"uwe".equalsIgnoreCase(course.getCategory())) {
            if ("Monsoon".equals(course.getSemesterType()) && course.getSemester() % 2 == 0) {
                throw new RuntimeException("Monsoon courses can only be offered in odd semesters.");
            }
            if ("Spring".equals(course.getSemesterType()) && course.getSemester() % 2 != 0) {
                throw new RuntimeException("Spring courses can only be offered in even semesters.");
            }
        }
    }

    private void validateGradedComponents(List<Course.GradingComponent> components) {
        if (components == null || components.isEmpty()) return;
        int totalWeight = 0;
        for (Course.GradingComponent gc : components) {
            if (gc.getWeight() <= 0) throw new RuntimeException("Component weight must be a positive integer.");
            if (gc.getName() == null || gc.getName().trim().isEmpty()) throw new RuntimeException("Component names cannot be empty.");
            
            if (gc.getName().matches("Best \\d+ of \\d+.*")) {
                String[] parts = gc.getName().split(" ");
                int n = Integer.parseInt(parts[1]);
                int m = Integer.parseInt(parts[3]);
                if (n > m) throw new RuntimeException("Best count cannot exceed total count.");
            }
            totalWeight += gc.getWeight();
        }
        if (totalWeight != 100) throw new RuntimeException("Total weightage must equal exactly 100%.");
    }

    public Course createCourse(Course course) {
        if (courseRepository.existsByCode(course.getCode())) {
            throw new RuntimeException("Course code already exists: " + course.getCode());
        }
        validateSemesterRules(course);
        course.setEnrolled(0);
        course.setResultsPublished(false);
        if (course.getStatus() == null) course.setStatus("Pending");
        return courseRepository.save(course);
    }

    public Course updateCourse(String code, Course updates) {
        Course course = getByCode(code);
        if (updates.getName() != null) course.setName(updates.getName());
        if (updates.getDescription() != null) course.setDescription(updates.getDescription());
        if (updates.getSyllabusTopics() != null) course.setSyllabusTopics(updates.getSyllabusTopics());
        if (updates.getGradedComponents() != null) {
            validateGradedComponents(updates.getGradedComponents());
            course.setGradedComponents(updates.getGradedComponents());
        }
        if (updates.getCredits() > 0) course.setCredits(updates.getCredits());
        if (updates.getFacultyId() != null) {
            course.setFacultyId(updates.getFacultyId());
            course.setFacultyName(updates.getFacultyName());
        }
        if (updates.getSemesterType() != null) course.setSemesterType(updates.getSemesterType());
        if (updates.getSemester() > 0) course.setSemester(updates.getSemester());
        validateSemesterRules(course);
        return courseRepository.save(course);
    }

    public Course toggleStatus(String code) {
        Course course = getByCode(code);
        course.setStatus("Active".equals(course.getStatus()) ? "Inactive" : "Active");
        return courseRepository.save(course);
    }

    public void publishResults(List<Integer> semesters) {
        // --- Phase 1: Grade finalization (existing logic) ---
        // Track all unique students that were graded, keyed by rollNo → (student, publishedSemester)
        Map<String, Integer> gradedStudentSemesters = new LinkedHashMap<>();

        List<Course> courses = courseRepository.findAll();
        for (Course c : courses) {
            if (semesters.contains(c.getSemester())) {
                c.setResultsPublished(true);
                c.setActiveSemester(false);
                courseRepository.save(c);

                Marks marks = marksRepository.findByCourseCode(c.getCode()).orElse(null);
                if (marks != null) {
                    marks.setActiveSemester(false);
                    marksRepository.save(marks);

                    for (Marks.StudentMark sm : marks.getStudentMarks()) {
                        double totalPercent = MarksService.calcWeightedTotal(sm.getMarks(), marks.getGradingComponents());
                        String gradeLetter = MarksService.getGradeLetter(totalPercent);
                        int gradePoints = MarksService.getGradePoints(gradeLetter);

                        Student student = studentRepository.findByRollNo(sm.getRollNo()).orElse(null);
                        if (student != null) {
                            for (Student.SemesterRecord semRecord : student.getAcademicRecord()) {
                                if (semRecord.getSemester() == c.getSemester()) {
                                    for (Student.CourseGrade cg : semRecord.getCourses()) {
                                        if (cg.getCourseCode().equals(c.getCode())) {
                                            cg.setGrade(gradeLetter);
                                            cg.setGradePoints(gradePoints);
                                        }
                                    }

                                    double totalWeighted = 0, totalCredits = 0;
                                    for (Student.CourseGrade cg : semRecord.getCourses()) {
                                        if (!"IP".equals(cg.getGrade())) {
                                            totalCredits += cg.getCredits();
                                            totalWeighted += cg.getCredits() * cg.getGradePoints();
                                        }
                                    }
                                    semRecord.setSgpa(totalCredits > 0 ? Math.round((totalWeighted / totalCredits) * 100.0) / 100.0 : 0);
                                }
                            }
                            studentRepository.save(student);

                            // Track this student for auto-enrollment
                            gradedStudentSemesters.put(sm.getRollNo(), c.getSemester());
                        }
                    }
                }
            }
        }

        // --- Phase 2: Auto-enroll graded students into next semester's core courses ---
        for (Map.Entry<String, Integer> entry : gradedStudentSemesters.entrySet()) {
            String rollNo = entry.getKey();
            int publishedSemester = entry.getValue();
            int nextSemester = publishedSemester + 1;

            if (nextSemester > 8) {
                // Mark student as inactive (graduated) instead of promoting to semester 9
                Student student = studentRepository.findByRollNo(rollNo).orElse(null);
                if (student != null && student.isActive()) {
                    student.setActive(false);
                    studentRepository.save(student);
                    log.info("Marked student {} as inactive (graduated) after semester 8", rollNo);
                }
                continue;
            }

            Student student = studentRepository.findByRollNo(rollNo).orElse(null);
            if (student == null) continue;

            // Extract department code: "BTech - ECE" → "ECE"
            String program = student.getProgram();
            String deptCode = program.contains(" - ") ? program.split(" - ")[1] : program;

            // Check if student already has a record for the next semester (avoid duplicates)
            boolean alreadyEnrolled = student.getAcademicRecord().stream()
                    .anyMatch(r -> r.getSemester() == nextSemester);
            if (alreadyEnrolled) continue;

            // Query core courses for (nextSemester, deptCode)
            List<Course> coreCourses = courseRepository.findBySemesterAndCategoryAndDepartmentCode(
                    nextSemester, "core", deptCode);

            if (coreCourses.isEmpty()) {
                log.warn("No core courses found for dept={} semester={}, skipping auto-enrollment for {}",
                        deptCode, nextSemester, rollNo);
                continue;
            }

            // Create a new SemesterRecord with all core courses
            Student.SemesterRecord newRecord = new Student.SemesterRecord();
            newRecord.setSemester(nextSemester);
            newRecord.setSgpa(0);
            newRecord.setCourses(new ArrayList<>());

            for (Course core : coreCourses) {
                Student.CourseGrade cg = new Student.CourseGrade();
                cg.setCourseCode(core.getCode());
                cg.setCourseName(core.getName());
                cg.setCredits(core.getCredits());
                cg.setGrade("IP");
                cg.setGradePoints(0);
                newRecord.getCourses().add(cg);

                // Add student to the marks roster
                marksService.addStudentToRoster(
                        core.getCode(), core.getName(), nextSemester,
                        student.getRollNo(), student.getName(),
                        core.getGradedComponents()
                );

                // Increment enrolled count
                core.setEnrolled(core.getEnrolled() + 1);
                courseRepository.save(core);
            }

            student.getAcademicRecord().add(newRecord);
            studentRepository.save(student);

            log.info("Auto-enrolled {} in {} core courses for semester {}",
                    rollNo, coreCourses.size(), nextSemester);
        }
    }

    /**
     * Bulk upload results for ALL active students.
     * For each student:
     *  1. Finalize grades for their currentSemester (mark "IP" courses with computed grades)
     *  2. If semester == 8, mark as graduated
     *  3. Otherwise, increment currentSemester and auto-enroll in next semester's core courses
     */
    public Map<String, Object> bulkUploadResults() {
        List<Student> allStudents = studentRepository.findAll();
        int promoted = 0, graduated = 0;
        List<String> failures = new ArrayList<>();

        for (Student student : allStudents) {
            try {
                int currentSem = student.getCurrentSemester();
                if (currentSem < 1 || currentSem > 8) continue;
                if (!student.isActive()) continue;

                // --- Step 1: Finalize grades for currentSemester ---
                Student.SemesterRecord semRecord = student.getAcademicRecord().stream()
                        .filter(r -> r.getSemester() == currentSem)
                        .findFirst().orElse(null);

                if (semRecord != null) {
                    for (Student.CourseGrade cg : semRecord.getCourses()) {
                        if ("IP".equals(cg.getGrade())) {
                            // Look up marks for this course
                            var marksOpt = marksRepository.findByCourseCode(cg.getCourseCode());
                            if (marksOpt.isPresent()) {
                                Marks marks = marksOpt.get();
                                // Find this student's marks entry
                                Marks.StudentMark sm = marks.getStudentMarks().stream()
                                        .filter(m -> m.getRollNo().equals(student.getRollNo()))
                                        .findFirst().orElse(null);
                                if (sm != null) {
                                    double totalPercent = MarksService.calcWeightedTotal(
                                            sm.getMarks(), marks.getGradingComponents());
                                    cg.setGrade(MarksService.getGradeLetter(totalPercent));
                                    cg.setGradePoints(MarksService.getGradePoints(cg.getGrade()));
                                    sm.setLocked(true);
                                    marksRepository.save(marks);
                                } else {
                                    // No marks entered — default to F
                                    cg.setGrade("F");
                                    cg.setGradePoints(0);
                                }
                            } else {
                                cg.setGrade("F");
                                cg.setGradePoints(0);
                            }
                        }
                    }

                    // Recompute SGPA
                    double totalWeighted = 0, totalCredits = 0;
                    for (Student.CourseGrade cg : semRecord.getCourses()) {
                        if (!"IP".equals(cg.getGrade())) {
                            totalCredits += cg.getCredits();
                            totalWeighted += cg.getCredits() * cg.getGradePoints();
                        }
                    }
                    semRecord.setSgpa(totalCredits > 0
                            ? Math.round((totalWeighted / totalCredits) * 100.0) / 100.0 : 0);
                }

                // --- Step 2: Lock courses for this semester (REMOVED) ---
                // We no longer lock the Course model because locking is enforced exclusively at the student row level.

                // --- Step 3: Promote or Graduate ---
                if (currentSem >= 8) {
                    // Graduate: mark student as inactive, keep semester at 8
                    student.setActive(false);
                    studentRepository.save(student);
                    graduated++;
                    log.info("Graduated student {} (marked inactive)", student.getRollNo());
                } else {
                    int nextSem = currentSem + 1;
                    student.setCurrentSemester(nextSem);

                    // Auto-enroll in next semester core courses
                    String program = student.getProgram();
                    String deptCode = program.contains(" - ") ? program.split(" - ")[1] : program;

                    boolean alreadyEnrolled = student.getAcademicRecord().stream()
                            .anyMatch(r -> r.getSemester() == nextSem);

                    if (!alreadyEnrolled) {
                        List<Course> coreCourses = courseRepository
                                .findBySemesterAndCategoryAndDepartmentCode(nextSem, "core", deptCode);

                        if (!coreCourses.isEmpty()) {
                            Student.SemesterRecord newRecord = new Student.SemesterRecord();
                            newRecord.setSemester(nextSem);
                            newRecord.setSgpa(0);
                            newRecord.setCourses(new ArrayList<>());

                            for (Course core : coreCourses) {
                                Student.CourseGrade cg = new Student.CourseGrade();
                                cg.setCourseCode(core.getCode());
                                cg.setCourseName(core.getName());
                                cg.setCredits(core.getCredits());
                                cg.setGrade("IP");
                                cg.setGradePoints(0);
                                newRecord.getCourses().add(cg);

                                marksService.addStudentToRoster(
                                        core.getCode(), core.getName(), nextSem,
                                        student.getRollNo(), student.getName(),
                                        core.getGradedComponents()
                                );

                                core.setEnrolled(core.getEnrolled() + 1);
                                courseRepository.save(core);
                            }

                            student.getAcademicRecord().add(newRecord);
                        }
                    }

                    studentRepository.save(student);
                    promoted++;
                    log.info("Promoted {} to semester {}", student.getRollNo(), nextSem);
                }
            } catch (Exception e) {
                log.error("Failed to process student {}: {}", student.getRollNo(), e.getMessage());
                failures.add(student.getRollNo());
            }
        }

        // --- Step 4: Toggle Active Term ---
        try {
            AppConfig currentSemesterConfig = appConfigRepository.findByKey("currentSemester").orElse(null);
            if (currentSemesterConfig != null && currentSemesterConfig.getValue() instanceof Map) {
                Map<String, Object> valMap = new HashMap<>((Map<String, Object>) currentSemesterConfig.getValue());
                String type = (String) valMap.get("type");
                int year = ((Number) valMap.getOrDefault("year", 2026)).intValue();
                
                if ("Spring".equalsIgnoreCase(type)) {
                    valMap.put("type", "Monsoon");
                } else if ("Monsoon".equalsIgnoreCase(type)) {
                    valMap.put("type", "Spring");
                    valMap.put("year", year + 1);
                }
                
                int currentNum = ((Number) valMap.getOrDefault("number", 1)).intValue();
                valMap.put("number", currentNum + 1);

                currentSemesterConfig.setValue(valMap);
                appConfigRepository.save(currentSemesterConfig);
                log.info("Active Term automatically shifted to {} {}", valMap.get("type"), valMap.get("year"));
            }
        } catch (Exception e) {
            log.error("Failed to automatically shift active term: {}", e.getMessage());
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("message", "Results uploaded successfully. All students have been promoted.");
        result.put("promoted", promoted);
        result.put("graduated", graduated);
        result.put("totalProcessed", promoted + graduated);
        if (!failures.isEmpty()) {
            result.put("failures", failures);
            result.put("message", "Results uploaded but enrollment failed for some students.");
        }
        return result;
    }

    public void incrementEnrollment(String code) {
        Course course = getByCode(code);
        course.setEnrolled(course.getEnrolled() + 1);
        courseRepository.save(course);
    }

    public void decrementEnrollment(String code) {
        Course course = getByCode(code);
        int next = course.getEnrolled() - 1;
        course.setEnrolled(Math.max(0, next));
        courseRepository.save(course);
    }
}

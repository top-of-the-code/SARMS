package com.sarms.service;

import com.sarms.dto.EnrollmentRequest;
import com.sarms.dto.GradeUpdateRequest;
import com.sarms.dto.StudentRegistrationRequest;
import com.sarms.dto.StudentRegistrationResponse;
import com.sarms.model.Course;
import com.sarms.model.Student;
import com.sarms.model.User;
import com.sarms.repository.CourseRepository;
import com.sarms.repository.StudentRepository;
import com.sarms.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CourseService courseService;
    private final MarksService marksService;
    private final CourseRepository courseRepository;

    private static final Map<String, Integer> GRADE_POINTS = Map.of(
            "A+", 10, "A", 9, "B+", 8, "B", 7, "C", 6, "D", 5, "F", 0
    );

    public StudentService(StudentRepository studentRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           CourseService courseService,
                           MarksService marksService,
                           CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.courseService = courseService;
        this.marksService = marksService;
        this.courseRepository = courseRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getByRollNo(String rollNo) {
        return studentRepository.findByRollNo(rollNo)
                .orElseThrow(() -> new RuntimeException("Student not found: " + rollNo));
    }

    public Student updateProfile(String rollNo, Student updates) {
        Student student = getByRollNo(rollNo);
        if (updates.getName() != null) student.setName(updates.getName());
        if (updates.getFatherName() != null) student.setFatherName(updates.getFatherName());
        if (updates.getMotherName() != null) student.setMotherName(updates.getMotherName());
        if (updates.getGuardianPhone() != null) student.setGuardianPhone(updates.getGuardianPhone());
        if (updates.getPersonalPhone() != null) student.setPersonalPhone(updates.getPersonalPhone());
        if (updates.getAddress() != null) student.setAddress(updates.getAddress());
        if (updates.getAddressDetails() != null) student.setAddressDetails(updates.getAddressDetails());
        if (updates.getProgram() != null) student.setProgram(updates.getProgram());
        if (updates.getBatchYear() != 0) student.setBatchYear(updates.getBatchYear());
        if (updates.getEmail() != null) student.setEmail(updates.getEmail());
        if (updates.getBloodGroup() != null) student.setBloodGroup(updates.getBloodGroup());
        if (updates.getDob() != null) student.setDob(updates.getDob());
        // Allow toggling active status (Change 7)
        student.setActive(updates.isActive());
        return studentRepository.save(student);
    }

    public Student updateGrades(String rollNo, GradeUpdateRequest request) {
        Student student = getByRollNo(rollNo);

        for (Student.SemesterRecord sem : student.getAcademicRecord()) {
            if (sem.getSemester() == request.getSemester()) {
                for (GradeUpdateRequest.CourseGradeUpdate update : request.getCourses()) {
                    for (Student.CourseGrade cg : sem.getCourses()) {
                        if (cg.getCourseCode().equals(update.getCourseCode()) && update.getNewGrade() != null && !update.getNewGrade().isEmpty()) {
                            cg.setGrade(update.getNewGrade());
                            cg.setGradePoints(GRADE_POINTS.getOrDefault(update.getNewGrade(), 0));
                        }
                    }
                }
                // Recompute SGPA
                double totalWeighted = 0, totalCredits = 0;
                for (Student.CourseGrade cg : sem.getCourses()) {
                    totalCredits += cg.getCredits();
                    totalWeighted += cg.getCredits() * cg.getGradePoints();
                }
                sem.setSgpa(totalCredits > 0 ? Math.round((totalWeighted / totalCredits) * 100.0) / 100.0 : 0);
                break;
            }
        }
        return studentRepository.save(student);
    }

    public StudentRegistrationResponse registerStudent(StudentRegistrationRequest request) {
        if (!request.getFullName().matches("^[A-Za-z\\s]+$") ||
            !request.getFatherName().matches("^[A-Za-z\\s]+$") ||
            !request.getMotherName().matches("^[A-Za-z\\s]+$")) {
            throw new RuntimeException("Names must solely contain alphabetic characters and spaces.");
        }

        if (!request.getPersonalPhone().matches("^\\d{10}$") ||
            !request.getGuardianPhone().matches("^\\d{10}$")) {
            throw new RuntimeException("Phone must be exactly 10 digits.");
        }

        LocalDate dobDate = LocalDate.parse(request.getDob());
        LocalDate minDate = LocalDate.of(1900, 1, 1);
        if (dobDate.isAfter(LocalDate.now()) || dobDate.isBefore(minDate)) {
            throw new RuntimeException("DOB must be between 1900 and today.");
        }

        if (studentRepository.existsByPersonalPhone(request.getPersonalPhone())) {
            throw new RuntimeException("Phone number already registered: " + request.getPersonalPhone());
        }

        // Generate roll number: STUD-{year}-{sequential}
        String prefix = "STUD-" + request.getBatchYear() + "-";
        long count = studentRepository.countByRollNoStartingWith(prefix);
        String rollNo = prefix + String.format("%03d", count + 1);

        // Generate temporary password
        String tempPassword = generatePassword();

        // Create User document
        User user = new User();
        user.setUserId(rollNo);
        user.setPasswordHash(passwordEncoder.encode(tempPassword));
        user.setRole("student");
        user.setName(request.getFullName());
        userRepository.save(user);

        // Create Student document with currentSemester = 1
        Student student = new Student();
        student.setRollNo(rollNo);
        student.setName(request.getFullName());
        student.setFatherName(request.getFatherName());
        student.setMotherName(request.getMotherName());
        student.setGuardianPhone(request.getGuardianPhone());
        student.setPersonalPhone(request.getPersonalPhone());
        // Build structured address (Change 9)
        if (request.getHouseNo() != null || request.getStreet() != null ||
            request.getCity() != null || request.getState() != null || request.getPinCode() != null) {
            Student.Address addr = new Student.Address();
            addr.setHouseNo(request.getHouseNo());
            addr.setStreet(request.getStreet());
            addr.setCity(request.getCity());
            addr.setState(request.getState());
            addr.setPinCode(request.getPinCode());
            student.setAddressDetails(addr);
            // Also set legacy flat string for backward compat
            String flatAddr = String.join(", ",
                    request.getHouseNo() != null ? request.getHouseNo() : "",
                    request.getStreet() != null ? request.getStreet() : "",
                    request.getCity() != null ? request.getCity() : "",
                    request.getState() != null ? request.getState() : "",
                    request.getPinCode() != null ? request.getPinCode() : ""
            ).replaceAll("(, )+", ", ").replaceAll("^, |, $", "");
            student.setAddress(flatAddr);
        } else if (request.getAddress() != null) {
            student.setAddress(request.getAddress());
        }
        student.setDob(LocalDate.parse(request.getDob()));
        student.setProgram(request.getProgram());
        student.setBatchYear(request.getBatchYear());
        student.setCurrentSemester(1);
        student.setActive(true);
        student.setEmail(request.getFullName().toLowerCase().replace(" ", ".") + "@mrca.edu");
        studentRepository.save(student);

        // Auto-enroll in semester 1 core courses for the student's department
        String deptCode = request.getProgram().contains(" - ")
                ? request.getProgram().split(" - ")[1] : request.getProgram();
        List<Course> sem1CoreCourses = courseRepository.findBySemesterAndCategoryAndDepartmentCode(
                1, "core", deptCode);

        if (!sem1CoreCourses.isEmpty()) {
            List<String> courseCodes = sem1CoreCourses.stream()
                    .map(Course::getCode).collect(Collectors.toList());
            EnrollmentRequest enrollReq = new EnrollmentRequest();
            enrollReq.setSemester(1);
            enrollReq.setCourseCodes(courseCodes);
            enrollInCourses(rollNo, enrollReq);
            log.info("Auto-enrolled {} in {} semester 1 core courses for dept {}",
                    rollNo, courseCodes.size(), deptCode);
        }

        return new StudentRegistrationResponse(rollNo, tempPassword, request.getFullName());
    }

    public Student enrollInCourses(String rollNo, EnrollmentRequest request) {
        Student student = getByRollNo(rollNo);
        int semester = request.getSemester();

        // Find or create the semester record
        Student.SemesterRecord semRecord = student.getAcademicRecord().stream()
                .filter(r -> r.getSemester() == semester)
                .findFirst()
                .orElse(null);

        if (semRecord == null) {
            semRecord = new Student.SemesterRecord();
            semRecord.setSemester(semester);
            semRecord.setCourses(new ArrayList<>());
            semRecord.setSgpa(0);
            student.getAcademicRecord().add(semRecord);
        }

        // Collect already-enrolled course codes for this semester
        Set<String> alreadyEnrolled = semRecord.getCourses().stream()
                .map(Student.CourseGrade::getCourseCode)
                .collect(Collectors.toSet());

        for (String courseCode : request.getCourseCodes()) {
            if (alreadyEnrolled.contains(courseCode)) continue;

            // Lookup the course from the database
            Course course = courseService.getByCode(courseCode);

            // Add a "Pending" grade entry to the student's academic record
            Student.CourseGrade cg = new Student.CourseGrade();
            cg.setCourseCode(course.getCode());
            cg.setCourseName(course.getName());
            cg.setCredits(course.getCredits());
            cg.setGrade("IP"); // In Progress
            cg.setGradePoints(0);
            semRecord.getCourses().add(cg);

            // Add student to the marks roster for this course
            marksService.addStudentToRoster(
                    course.getCode(), course.getName(), semester,
                    student.getRollNo(), student.getName(),
                    course.getGradedComponents()
            );

            // Increment the enrolled count on the course
            courseService.incrementEnrollment(courseCode);
        }

        semRecord.setRegistrationFinalized(true);

        return studentRepository.save(student);
    }

    private String generatePassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}

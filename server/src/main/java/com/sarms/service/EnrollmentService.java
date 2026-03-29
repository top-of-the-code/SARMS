package com.sarms.service;

import com.sarms.model.Enrollment;
import com.sarms.model.Course;
import com.sarms.repository.EnrollmentRepository;
import com.sarms.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private static final int MAX_CREDITS = 25;

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    public List<Enrollment> getByStudent(String rollNo) {
        return enrollmentRepository.findByRollNo(rollNo);
    }

    public List<Enrollment> registerCourses(String rollNo, List<String> courseCodes) {
        // Calculate total credits
        double totalCredits = 0;
        for (String code : courseCodes) {
            Course course = courseRepository.findByCode(code)
                    .orElseThrow(() -> new RuntimeException("Course not found: " + code));
            totalCredits += course.getCredits();
        }

        if (totalCredits > MAX_CREDITS) {
            throw new RuntimeException("Total credits (" + totalCredits + ") exceeds maximum of " + MAX_CREDITS);
        }

        // Delete existing enrollments for this student (re-registration)
        List<Enrollment> existing = enrollmentRepository.findByRollNo(rollNo);
        enrollmentRepository.deleteAll(existing);

        // Create new enrollments
        List<Enrollment> enrollments = courseCodes.stream().map(code -> {
            Course course = courseRepository.findByCode(code).orElse(null);
            Enrollment e = new Enrollment();
            e.setRollNo(rollNo);
            e.setCourseCode(code);
            e.setSemester(course != null ? course.getSemester() : 0);
            e.setConfirmed(true);
            e.setEnrolledAt(Instant.now());
            return e;
        }).collect(Collectors.toList());

        return enrollmentRepository.saveAll(enrollments);
    }

    public List<String> getEnrolledCourseCodes(String rollNo) {
        return enrollmentRepository.findByRollNo(rollNo).stream()
                .map(Enrollment::getCourseCode)
                .collect(Collectors.toList());
    }
}

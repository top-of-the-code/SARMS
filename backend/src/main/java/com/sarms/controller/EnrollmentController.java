package com.sarms.controller;

import com.sarms.dto.EnrollmentRequest;
import com.sarms.model.Enrollment;
import com.sarms.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/student/{rollNo}")
    public List<Enrollment> getByStudent(@PathVariable String rollNo) {
        return enrollmentService.getByStudent(rollNo);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(Authentication authentication,
                                       @RequestBody EnrollmentRequest request) {
        try {
            String rollNo = (String) authentication.getPrincipal();
            List<Enrollment> enrollments = enrollmentService.registerCourses(rollNo, request.getCourseCodes());
            return ResponseEntity.ok(enrollments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

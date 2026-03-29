package com.sarms.controller;

import com.sarms.dto.EnrollmentRequest;
import com.sarms.dto.GradeUpdateRequest;
import com.sarms.dto.StudentRegistrationRequest;
import com.sarms.dto.StudentRegistrationResponse;
import com.sarms.model.Student;
import com.sarms.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<Student> getAll() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{rollNo}")
    public ResponseEntity<?> getByRollNo(@PathVariable String rollNo) {
        try {
            return ResponseEntity.ok(studentService.getByRollNo(rollNo));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{rollNo}")
    public ResponseEntity<?> updateProfile(@PathVariable String rollNo, @RequestBody Student updates) {
        try {
            return ResponseEntity.ok(studentService.updateProfile(rollNo, updates));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{rollNo}/grades")
    public ResponseEntity<?> updateGrades(@PathVariable String rollNo, @RequestBody GradeUpdateRequest request) {
        try {
            return ResponseEntity.ok(studentService.updateGrades(rollNo, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{rollNo}/enroll")
    public ResponseEntity<?> enroll(@PathVariable String rollNo, @RequestBody EnrollmentRequest request) {
        try {
            return ResponseEntity.ok(studentService.enrollInCourses(rollNo, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody StudentRegistrationRequest request) {
        try {
            StudentRegistrationResponse response = studentService.registerStudent(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}


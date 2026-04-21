package com.sarms.controller;

import com.sarms.model.Course;
import com.sarms.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<Course> getAll(@RequestParam(required = false) Integer semester,
                               @RequestParam(required = false) String facultyId,
                               @RequestParam(required = false) String category) {
        if (semester != null) return courseService.getBySemester(semester);
        if (facultyId != null) return courseService.getByFacultyId(facultyId);
        return courseService.getAllCourses();
    }

    @GetMapping("/{code}")
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        try {
            return ResponseEntity.ok(courseService.getByCode(code));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Course course) {
        try {
            return ResponseEntity.ok(courseService.createCourse(course));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{code}")
    public ResponseEntity<?> update(@PathVariable String code, @RequestBody Course updates) {
        try {
            return ResponseEntity.ok(courseService.updateCourse(code, updates));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{code}/status")
    public ResponseEntity<?> toggleStatus(@PathVariable String code) {
        try {
            return ResponseEntity.ok(courseService.toggleStatus(code));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/publish")
    public ResponseEntity<?> publishResults(@RequestBody Map<String, List<Integer>> body) {
        List<Integer> semesters = body.get("semesters");
        courseService.publishResults(semesters);
        return ResponseEntity.ok(Map.of("message", "Results published"));
    }
}

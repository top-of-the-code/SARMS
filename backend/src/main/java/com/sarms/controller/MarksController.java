package com.sarms.controller;

import com.sarms.model.Course;
import com.sarms.model.Marks;
import com.sarms.service.MarksService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @GetMapping("/{courseCode}")
    public ResponseEntity<?> getByCourseCode(@PathVariable String courseCode) {
        try {
            return ResponseEntity.ok(marksService.getByCourseCode(courseCode));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{courseCode}")
    public ResponseEntity<?> updateMarks(@PathVariable String courseCode,
                                          @RequestBody List<Marks.StudentMark> studentMarks) {
        try {
            return ResponseEntity.ok(marksService.updateStudentMarks(courseCode, studentMarks));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{courseCode}/components")
    public ResponseEntity<?> updateComponents(@PathVariable String courseCode,
                                               @RequestBody List<Course.GradingComponent> components) {
        try {
            return ResponseEntity.ok(marksService.updateGradingComponents(courseCode, components));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

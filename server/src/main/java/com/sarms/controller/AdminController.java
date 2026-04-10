package com.sarms.controller;

import com.sarms.model.User;
import com.sarms.repository.UserRepository;
import com.sarms.service.AdminService;
import com.sarms.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CourseService courseService;
    private final AdminService adminService;

    public AdminController(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           CourseService courseService,
                           AdminService adminService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.courseService = courseService;
        this.adminService = adminService;
    }

    @PostMapping("/term")
    public ResponseEntity<?> setActiveTerm(@RequestBody Map<String, Object> body) {
        String term = (String) body.get("term");
        int year = ((Number) body.get("year")).intValue();
        
        try {
            Map<String, Object> result = adminService.setActiveTerm(term, year);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-registrations")
    public ResponseEntity<?> resetRegistrations(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String password = body.get("password");

        // Re-verify admin credentials for destructive action
        User user = userRepository.findByUserId(userId).orElse(null);
        if (user == null || !"admin".equals(user.getRole())
                || !passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid admin credentials"));
        }

        try {
            Map<String, Object> result = adminService.resetCurrentTermRegistrations();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/upload-results")
    public ResponseEntity<?> uploadResults(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String password = body.get("password");

        // Re-verify admin credentials
        User user = userRepository.findByUserId(userId).orElse(null);
        if (user == null || !"admin".equals(user.getRole())
                || !passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid admin credentials"));
        }

        // Execute bulk result upload
        try {
            Map<String, Object> result = courseService.bulkUploadResults();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    @PostMapping("/full-reset")
    public ResponseEntity<?> fullSystemReset() {
        try {
            Map<String, Object> result = adminService.fullSystemReset();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Full reset failed: " + e.getMessage()));
        }
    }
}

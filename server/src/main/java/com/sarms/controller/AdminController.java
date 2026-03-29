package com.sarms.controller;

import com.sarms.model.User;
import com.sarms.repository.UserRepository;
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

    public AdminController(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           CourseService courseService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.courseService = courseService;
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
}

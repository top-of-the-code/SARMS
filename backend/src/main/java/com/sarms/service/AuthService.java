package com.sarms.service;

import com.sarms.dto.LoginRequest;
import com.sarms.dto.LoginResponse;
import com.sarms.dto.PasswordResetRequest;
import com.sarms.model.User;
import com.sarms.repository.UserRepository;
import com.sarms.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUserId(request.getUserId().trim())
                .orElseThrow(() -> new RuntimeException("Invalid ID or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid ID or password");
        }

        String token = jwtUtil.generateToken(user.getUserId(), user.getRole(), user.getName());
        return new LoginResponse(token, user.getUserId(), user.getRole(), user.getName());
    }

    public void resetPassword(PasswordResetRequest request) {
        User user = userRepository.findByUserId(request.getUserId().trim())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getNewPassword().length() < 4) {
            throw new RuntimeException("Password must be at least 4 characters");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public User getCurrentUser(String userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

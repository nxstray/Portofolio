package com.beingexiled.serverBlog.controller;

import com.beingexiled.serverBlog.entity.User;
import com.beingexiled.serverBlog.payload.ForgotPasswordRequest;
import com.beingexiled.serverBlog.payload.ResetPasswordRequest;
import com.beingexiled.serverBlog.repository.UserRepository;
import com.beingexiled.serverBlog.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> payload, HttpServletResponse response) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(email);
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkLoginStatus(@CookieValue(value = "jwt", required = false) String token) {
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }
        String email = jwtUtil.getEmailFromToken(token);
        return ResponseEntity.ok(Map.of("email", email));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String identifier = request.getEmailOrUsername();

        if (identifier == null || identifier.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email or username is required");
        }

        Optional<User> optionalUser = userRepository.findByEmail(identifier);
        if (optionalUser.isEmpty()) {
            optionalUser = userRepository.findByUsername(identifier);
        }

        if (optionalUser.isEmpty()) {
            return ResponseEntity.ok("If the account exists, a reset link has been sent.");
        }

        User user = optionalUser.get();
        String token = UUID.randomUUID().toString();

        user.setResetToken(token);
        user.setResetTokenCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        String resetLink = "http://localhost:4200/auth/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Reset Your Password");
        message.setText("Click the link below to reset your password:\n\n" + resetLink);

        mailSender.send(message);

        return ResponseEntity.ok("If the account exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        String token = request.getToken();
        String newPassword = request.getNewPassword();

        if (token == null || newPassword == null || token.isBlank() || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Token and new password are required");
        }

        Optional<User> optionalUser = userRepository.findByResetToken(token);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }

        User user = optionalUser.get();

        if (user.getResetTokenCreatedAt() != null &&
            user.getResetTokenCreatedAt().isBefore(LocalDateTime.now().minusMinutes(30))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenCreatedAt(null);
        userRepository.save(user);

        String jwt = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(Map.of("token", jwt));
    }
}
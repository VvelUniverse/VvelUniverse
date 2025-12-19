package com.vveluniverse.controller;

import com.vveluniverse.dto.ApiResponse;
import com.vveluniverse.dto.JwtResponse;
import com.vveluniverse.dto.LoginRequest;
import com.vveluniverse.dto.RegisterRequest;
import com.vveluniverse.model.User;
import com.vveluniverse.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.registerUser(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "User registered successfully", user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", jwtResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid email or password"));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> checkAuthStatus() {
        return ResponseEntity.ok(new ApiResponse(true, "Authentication endpoint is working"));
    }
}


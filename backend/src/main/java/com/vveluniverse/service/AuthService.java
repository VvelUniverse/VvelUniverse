package com.vveluniverse.service;

import com.vveluniverse.dto.JwtResponse;
import com.vveluniverse.dto.LoginRequest;
import com.vveluniverse.dto.RegisterRequest;
import com.vveluniverse.model.User;
import com.vveluniverse.repository.UserRepository;
import com.vveluniverse.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public User registerUser(RegisterRequest registerRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        if (userRepository.existsByMobile(registerRequest.getMobile())) {
            throw new RuntimeException("Mobile number already in use");
        }

        // Create new user
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail().toLowerCase());
        user.setMobile(registerRequest.getMobile());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setProvider("local");

        return userRepository.save(user);
    }

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        // Get user details
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new JwtResponse(jwt, user.getId(), user.getEmail(), user.getName(), user.getIsAdmin());
    }
}


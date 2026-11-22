package com.adhikarsetu.service;

import com.adhikarsetu.dto.*;
import com.adhikarsetu.entity.User;
import com.adhikarsetu.repository.UserRepository;
import com.adhikarsetu.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users; this.encoder = encoder; this.jwt = jwt;
    }
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmail(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        User user = new User(); user.setName(request.name().trim()); user.setEmail(email);
        user.setPassword(encoder.encode(request.password())); users.save(user);
        return response(user);
    }
    public AuthResponse login(LoginRequest request) {
        User user = users.findByEmail(request.email().trim().toLowerCase())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!encoder.matches(request.password(), user.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        return response(user);
    }
    private AuthResponse response(User user) {
        return new AuthResponse(jwt.generate(user.getEmail()),
            new AuthResponse.UserSummary(user.getId(), user.getName(), user.getEmail()));
    }
}

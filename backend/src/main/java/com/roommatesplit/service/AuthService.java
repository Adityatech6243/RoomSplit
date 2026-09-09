package com.roommatesplit.service;

import com.roommatesplit.dto.auth.AuthResponse;
import com.roommatesplit.dto.auth.LoginRequest;
import com.roommatesplit.dto.auth.RegisterRequest;
import com.roommatesplit.dto.user.UserResponse;
import com.roommatesplit.entity.User;
import com.roommatesplit.exception.BadRequestException;
import com.roommatesplit.exception.UnauthorizedException;
import com.roommatesplit.repository.UserRepository;
import com.roommatesplit.security.JwtService;
import com.roommatesplit.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        User user = new User(
            request.getName().trim(),
            request.getEmail().toLowerCase().trim(),
            passwordEncoder.encode(request.getPassword()),
            request.getPhone() != null ? request.getPhone().trim() : null,
            null
        );

        User savedUser = userRepository.save(user);
        UserPrincipal principal = UserPrincipal.create(savedUser);
        String token = jwtService.generateToken(principal);

        return new AuthResponse(token, UserResponse.fromEntity(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String token = jwtService.generateToken(principal);

        return new AuthResponse(token, UserResponse.fromEntity(user));
    }
}

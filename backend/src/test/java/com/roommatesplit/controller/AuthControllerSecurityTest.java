package com.roommatesplit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.roommatesplit.config.CorsConfig;
import com.roommatesplit.config.SecurityConfig;
import com.roommatesplit.dto.auth.AuthResponse;
import com.roommatesplit.dto.auth.LoginRequest;
import com.roommatesplit.dto.auth.RegisterRequest;
import com.roommatesplit.dto.user.UserResponse;
import com.roommatesplit.exception.GlobalExceptionHandler;
import com.roommatesplit.exception.UnauthorizedException;
import com.roommatesplit.security.CustomUserDetailsService;
import com.roommatesplit.security.JwtAuthenticationFilter;
import com.roommatesplit.security.JwtService;
import com.roommatesplit.security.UserPrincipal;
import com.roommatesplit.service.AuthService;
import com.roommatesplit.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {AuthController.class, UserController.class})
@Import({SecurityConfig.class, CorsConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class AuthControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("POST /api/auth/login succeeds for valid credentials without prior token")
    void testApiAuthLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("password123");

        UserResponse userResponse = new UserResponse("1", "Test User", "user@example.com", "1234567890", null, java.time.LocalDateTime.now());
        AuthResponse authResponse = new AuthResponse("valid.jwt.token", userResponse);

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("valid.jwt.token"))
            .andExpect(jsonPath("$.user.email").value("user@example.com"));
    }

    @Test
    @DisplayName("POST /auth/login (root without /api) succeeds and is permitted by security")
    void testRootAuthLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("password123");

        UserResponse userResponse = new UserResponse("1", "Test User", "user@example.com", "1234567890", null, java.time.LocalDateTime.now());
        AuthResponse authResponse = new AuthResponse("valid.jwt.token", userResponse);

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("valid.jwt.token"))
            .andExpect(jsonPath("$.user.email").value("user@example.com"));
    }

    @Test
    @DisplayName("POST /api/auth/login with invalid credentials returns 401 Unauthorized")
    void testLoginInvalidCredentialsReturns401() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("wrongpassword");

        when(authService.login(any(LoginRequest.class)))
            .thenThrow(new UnauthorizedException("Invalid email or password"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.status").value(401))
            .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    @DisplayName("POST /auth/register and /api/auth/register are permitted without prior token")
    void testRegisterPermitted() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("New User");
        request.setEmail("newuser@example.com");
        request.setPassword("securePassword123");

        UserResponse userResponse = new UserResponse("2", "New User", "newuser@example.com", null, null, java.time.LocalDateTime.now());
        AuthResponse authResponse = new AuthResponse("token.reg.123", userResponse);

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.token").value("token.reg.123"));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.token").value("token.reg.123"));
    }

    @Test
    @DisplayName("Unauthenticated request to protected endpoint /api/users/me returns 401 Unauthorized")
    void testProtectedEndpointReturns401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/users/me"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("CORS preflight OPTIONS request returns 200 OK and allows Vercel origin")
    void testCorsPreflightAllowsVercel() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                .header("Origin", "https://frontend-six-rouge-tmg45jbav5.vercel.app")
                .header("Access-Control-Request-Method", "POST"))
            .andExpect(status().isOk())
            .andExpect(header().string("Access-Control-Allow-Origin", "https://frontend-six-rouge-tmg45jbav5.vercel.app"))
            .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    }
}

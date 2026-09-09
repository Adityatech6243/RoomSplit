package com.roommatesplit.controller;

import com.roommatesplit.dto.user.UpdateProfileRequest;
import com.roommatesplit.dto.user.UserResponse;
import com.roommatesplit.security.UserPrincipal;
import com.roommatesplit.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse response = userService.getUserProfile(userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserResponse response = userService.updateProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(response);
    }
}

package com.roommatesplit.dto.room;

import com.roommatesplit.dto.user.UserResponse;
import com.roommatesplit.entity.RoomMember;
import com.roommatesplit.enums.RoomRole;
import java.time.LocalDateTime;

public class RoomMemberResponse {

    private Long id;
    private UserResponse user;
    private RoomRole role;
    private Boolean isActive;
    private LocalDateTime joinedAt;

    public RoomMemberResponse() {
    }

    public RoomMemberResponse(Long id, UserResponse user, RoomRole role, Boolean isActive, LocalDateTime joinedAt) {
        this.id = id;
        this.user = user;
        this.role = role;
        this.isActive = isActive != null ? isActive : true;
        this.joinedAt = joinedAt;
    }

    public static RoomMemberResponse fromEntity(RoomMember member) {
        if (member == null) return null;
        return new RoomMemberResponse(
            member.getId(),
            UserResponse.fromEntity(member.getUser()),
            member.getRole(),
            member.getIsActive(),
            member.getJoinedAt()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public RoomRole getRole() {
        return role;
    }

    public void setRole(RoomRole role) {
        this.role = role;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}

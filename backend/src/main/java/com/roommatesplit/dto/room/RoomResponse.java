package com.roommatesplit.dto.room;

import com.roommatesplit.dto.user.UserResponse;
import com.roommatesplit.entity.Room;
import com.roommatesplit.enums.RoomRole;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RoomResponse {

    private Long id;
    private String roomName;
    private String roomCode;
    private String currency;
    private BigDecimal monthlyBudget;
    private UserResponse createdBy;
    private LocalDateTime createdAt;
    private RoomRole currentUserRole;
    private Long memberCount;
    private BigDecimal totalExpenses;

    public RoomResponse() {
    }

    public RoomResponse(Long id, String roomName, String roomCode, String currency, BigDecimal monthlyBudget,
                        UserResponse createdBy, LocalDateTime createdAt, RoomRole currentUserRole,
                        Long memberCount, BigDecimal totalExpenses) {
        this.id = id;
        this.roomName = roomName;
        this.roomCode = roomCode;
        this.currency = currency;
        this.monthlyBudget = monthlyBudget;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.currentUserRole = currentUserRole;
        this.memberCount = memberCount;
        this.totalExpenses = totalExpenses;
    }

    public static RoomResponse fromEntity(Room room, RoomRole role, Long memberCount, BigDecimal totalExpenses) {
        if (room == null) return null;
        return new RoomResponse(
            room.getId(),
            room.getRoomName(),
            room.getRoomCode(),
            room.getCurrency(),
            room.getMonthlyBudget(),
            UserResponse.fromEntity(room.getCreatedBy()),
            room.getCreatedAt(),
            role,
            memberCount,
            totalExpenses != null ? totalExpenses : BigDecimal.ZERO
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(BigDecimal monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public UserResponse getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserResponse createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public RoomRole getCurrentUserRole() {
        return currentUserRole;
    }

    public void setCurrentUserRole(RoomRole currentUserRole) {
        this.currentUserRole = currentUserRole;
    }

    public Long getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(Long memberCount) {
        this.memberCount = memberCount;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }
}

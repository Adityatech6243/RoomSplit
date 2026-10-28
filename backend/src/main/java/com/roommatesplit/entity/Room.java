package com.roommatesplit.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "rooms")
public class Room {

    @Id
    private String id;

    private String roomName;

    @Indexed(unique = true)
    private String roomCode;

    private String currency = "INR";

    private BigDecimal monthlyBudget = BigDecimal.ZERO;

    @DocumentReference(lazy = true)
    private User createdBy;

    private LocalDateTime createdAt;

    public Room() {
    }

    public Room(String roomName, String roomCode, String currency, BigDecimal monthlyBudget, User createdBy) {
        this.roomName = roomName;
        this.roomCode = roomCode;
        this.currency = currency != null ? currency : "INR";
        this.monthlyBudget = monthlyBudget != null ? monthlyBudget : BigDecimal.ZERO;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
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
        this.currency = currency != null ? currency : "INR";
    }

    public BigDecimal getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(BigDecimal monthlyBudget) {
        this.monthlyBudget = monthlyBudget != null ? monthlyBudget : BigDecimal.ZERO;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

package com.roommatesplit.entity;

import com.roommatesplit.enums.SettlementStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "settlements")
public class Settlement {

    @Id
    private String id;

    private String roomId;

    @DocumentReference(lazy = true)
    private Room room;

    private String paidById;

    @DocumentReference(lazy = true)
    private User paidBy;

    private String paidToId;

    @DocumentReference(lazy = true)
    private User paidTo;

    private BigDecimal amount;

    private SettlementStatus status = SettlementStatus.PENDING;

    private String paymentMethod;

    private String notes;

    private LocalDateTime settledAt;

    private LocalDateTime createdAt;

    public Settlement() {
    }

    public Settlement(Room room, User paidBy, User paidTo, BigDecimal amount, SettlementStatus status, String paymentMethod, String notes) {
        this.room = room;
        this.roomId = room != null ? room.getId() : null;
        this.paidBy = paidBy;
        this.paidById = paidBy != null ? paidBy.getId() : null;
        this.paidTo = paidTo;
        this.paidToId = paidTo != null ? paidTo.getId() : null;
        this.amount = amount;
        this.status = status != null ? status : SettlementStatus.PENDING;
        this.paymentMethod = paymentMethod;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomId() {
        return roomId != null ? roomId : (room != null ? room.getId() : null);
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
        if (room != null) {
            this.roomId = room.getId();
        }
    }

    public String getPaidById() {
        return paidById != null ? paidById : (paidBy != null ? paidBy.getId() : null);
    }

    public void setPaidById(String paidById) {
        this.paidById = paidById;
    }

    public User getPaidBy() {
        return paidBy;
    }

    public void setPaidBy(User paidBy) {
        this.paidBy = paidBy;
        if (paidBy != null) {
            this.paidById = paidBy.getId();
        }
    }

    public String getPaidToId() {
        return paidToId != null ? paidToId : (paidTo != null ? paidTo.getId() : null);
    }

    public void setPaidToId(String paidToId) {
        this.paidToId = paidToId;
    }

    public User getPaidTo() {
        return paidTo;
    }

    public void setPaidTo(User paidTo) {
        this.paidTo = paidTo;
        if (paidTo != null) {
            this.paidToId = paidTo.getId();
        }
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public SettlementStatus getStatus() {
        return status;
    }

    public void setStatus(SettlementStatus status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getSettledAt() {
        return settledAt;
    }

    public void setSettledAt(LocalDateTime settledAt) {
        this.settledAt = settledAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

package com.roommatesplit.dto.settlement;

import com.roommatesplit.dto.user.UserResponse;
import com.roommatesplit.entity.Settlement;
import com.roommatesplit.enums.SettlementStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SettlementResponse {

    private Long id;
    private Long roomId;
    private UserResponse paidBy;
    private UserResponse paidTo;
    private BigDecimal amount;
    private SettlementStatus status;
    private String paymentMethod;
    private String notes;
    private LocalDateTime settledAt;
    private LocalDateTime createdAt;

    public SettlementResponse() {
    }

    public SettlementResponse(Long id, Long roomId, UserResponse paidBy, UserResponse paidTo,
                              BigDecimal amount, SettlementStatus status, String paymentMethod,
                              String notes, LocalDateTime settledAt, LocalDateTime createdAt) {
        this.id = id;
        this.roomId = roomId;
        this.paidBy = paidBy;
        this.paidTo = paidTo;
        this.amount = amount;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.notes = notes;
        this.settledAt = settledAt;
        this.createdAt = createdAt;
    }

    public static SettlementResponse fromEntity(Settlement settlement) {
        if (settlement == null) return null;
        return new SettlementResponse(
            settlement.getId(),
            settlement.getRoom() != null ? settlement.getRoom().getId() : null,
            UserResponse.fromEntity(settlement.getPaidBy()),
            UserResponse.fromEntity(settlement.getPaidTo()),
            settlement.getAmount(),
            settlement.getStatus(),
            settlement.getPaymentMethod(),
            settlement.getNotes(),
            settlement.getSettledAt(),
            settlement.getCreatedAt()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public UserResponse getPaidBy() {
        return paidBy;
    }

    public void setPaidBy(UserResponse paidBy) {
        this.paidBy = paidBy;
    }

    public UserResponse getPaidTo() {
        return paidTo;
    }

    public void setPaidTo(UserResponse paidTo) {
        this.paidTo = paidTo;
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

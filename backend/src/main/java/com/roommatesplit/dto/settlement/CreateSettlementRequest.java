package com.roommatesplit.dto.settlement;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class CreateSettlementRequest {

    @NotNull(message = "Room ID is required")
    private String roomId;

    @NotNull(message = "Paid To User ID is required")
    private String paidTo;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    private String paymentMethod = "CASH";

    @Size(max = 255, message = "Notes cannot exceed 255 characters")
    private String notes;

    public CreateSettlementRequest() {
    }

    public CreateSettlementRequest(String roomId, String paidTo, BigDecimal amount, String paymentMethod, String notes) {
        this.roomId = roomId;
        this.paidTo = paidTo;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.notes = notes;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getPaidTo() {
        return paidTo;
    }

    public void setPaidTo(String paidTo) {
        this.paidTo = paidTo;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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
}

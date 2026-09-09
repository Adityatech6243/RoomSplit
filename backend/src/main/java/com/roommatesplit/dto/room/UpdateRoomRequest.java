package com.roommatesplit.dto.room;

import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class UpdateRoomRequest {

    @Size(min = 2, max = 100, message = "Room name must be between 2 and 100 characters")
    private String roomName;

    private String currency;
    private BigDecimal monthlyBudget;

    public UpdateRoomRequest() {
    }

    public UpdateRoomRequest(String roomName, String currency, BigDecimal monthlyBudget) {
        this.roomName = roomName;
        this.currency = currency;
        this.monthlyBudget = monthlyBudget;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
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
}

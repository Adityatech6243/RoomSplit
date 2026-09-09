package com.roommatesplit.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class CreateRoomRequest {

    @NotBlank(message = "Room name is required")
    @Size(min = 2, max = 100, message = "Room name must be between 2 and 100 characters")
    private String roomName;

    private String currency = "INR";

    @PositiveOrZero(message = "Monthly budget must be positive or zero")
    private BigDecimal monthlyBudget = BigDecimal.ZERO;

    public CreateRoomRequest() {
    }

    public CreateRoomRequest(String roomName, String currency, BigDecimal monthlyBudget) {
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

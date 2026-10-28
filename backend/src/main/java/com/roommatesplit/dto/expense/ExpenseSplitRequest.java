package com.roommatesplit.dto.expense;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public class ExpenseSplitRequest {

    @NotNull(message = "User ID is required")
    private String userId;

    @NotNull(message = "Share amount is required")
    @PositiveOrZero(message = "Share amount must be non-negative")
    private BigDecimal shareAmount;

    public ExpenseSplitRequest() {
    }

    public ExpenseSplitRequest(String userId, BigDecimal shareAmount) {
        this.userId = userId;
        this.shareAmount = shareAmount;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(BigDecimal shareAmount) {
        this.shareAmount = shareAmount;
    }
}

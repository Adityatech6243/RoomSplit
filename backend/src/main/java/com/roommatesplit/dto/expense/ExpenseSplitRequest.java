package com.roommatesplit.dto.expense;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public class ExpenseSplitRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Share amount is required")
    @PositiveOrZero(message = "Share amount must be non-negative")
    private BigDecimal shareAmount;

    public ExpenseSplitRequest() {
    }

    public ExpenseSplitRequest(Long userId, BigDecimal shareAmount) {
        this.userId = userId;
        this.shareAmount = shareAmount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(BigDecimal shareAmount) {
        this.shareAmount = shareAmount;
    }
}

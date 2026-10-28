package com.roommatesplit.dto.expense;

import com.roommatesplit.dto.user.UserResponse;
import com.roommatesplit.entity.ExpenseSplit;
import java.math.BigDecimal;

public class ExpenseSplitResponse {

    private String id;
    private UserResponse user;
    private BigDecimal shareAmount;

    public ExpenseSplitResponse() {
    }

    public ExpenseSplitResponse(String id, UserResponse user, BigDecimal shareAmount) {
        this.id = id;
        this.user = user;
        this.shareAmount = shareAmount;
    }

    public static ExpenseSplitResponse fromEntity(ExpenseSplit split) {
        if (split == null) return null;
        return new ExpenseSplitResponse(
            split.getId(),
            UserResponse.fromEntity(split.getUser()),
            split.getShareAmount()
        );
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(BigDecimal shareAmount) {
        this.shareAmount = shareAmount;
    }
}

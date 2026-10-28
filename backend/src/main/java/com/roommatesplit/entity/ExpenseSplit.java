package com.roommatesplit.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "expense_splits")
public class ExpenseSplit {

    @Id
    private String id;

    private String expenseId;

    private String roomId;

    private String userId;

    @DocumentReference(lazy = true)
    private Expense expense;

    @DocumentReference(lazy = true)
    private User user;

    private BigDecimal shareAmount;

    private LocalDateTime createdAt;

    public ExpenseSplit() {
    }

    public ExpenseSplit(Expense expense, User user, BigDecimal shareAmount) {
        this.expense = expense;
        this.user = user;
        this.expenseId = expense != null ? expense.getId() : null;
        this.roomId = expense != null ? expense.getRoomId() : null;
        this.userId = user != null ? user.getId() : null;
        this.shareAmount = shareAmount;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getExpenseId() {
        return expenseId != null ? expenseId : (expense != null ? expense.getId() : null);
    }

    public void setExpenseId(String expenseId) {
        this.expenseId = expenseId;
    }

    public String getRoomId() {
        return roomId != null ? roomId : (expense != null ? expense.getRoomId() : null);
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getUserId() {
        return userId != null ? userId : (user != null ? user.getId() : null);
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Expense getExpense() {
        return expense;
    }

    public void setExpense(Expense expense) {
        this.expense = expense;
        if (expense != null) {
            this.expenseId = expense.getId();
            this.roomId = expense.getRoomId();
        }
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            this.userId = user.getId();
        }
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(BigDecimal shareAmount) {
        this.shareAmount = shareAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

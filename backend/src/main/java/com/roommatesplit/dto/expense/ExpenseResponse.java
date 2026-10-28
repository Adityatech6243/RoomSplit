package com.roommatesplit.dto.expense;

import com.roommatesplit.dto.user.UserResponse;
import com.roommatesplit.entity.Expense;
import com.roommatesplit.enums.ExpenseCategory;
import com.roommatesplit.enums.SplitType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ExpenseResponse {

    private String id;
    private String roomId;
    private String title;
    private String description;
    private BigDecimal amount;
    private ExpenseCategory category;
    private LocalDate date;
    private UserResponse paidBy;
    private SplitType splitType;
    private List<ExpenseSplitResponse> splits;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ExpenseResponse() {
    }

    public ExpenseResponse(String id, String roomId, String title, String description, BigDecimal amount,
                           ExpenseCategory category, LocalDate date, UserResponse paidBy,
                           SplitType splitType, List<ExpenseSplitResponse> splits,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.roomId = roomId;
        this.title = title != null && !title.trim().isEmpty() ? title : description;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.paidBy = paidBy;
        this.splitType = splitType;
        this.splits = splits;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ExpenseResponse fromEntity(Expense expense, List<ExpenseSplitResponse> splits) {
        if (expense == null) return null;
        return new ExpenseResponse(
            expense.getId(),
            expense.getRoomId(),
            expense.getTitle(),
            expense.getDescription(),
            expense.getAmount(),
            expense.getCategory(),
            expense.getDate(),
            UserResponse.fromEntity(expense.getPaidBy()),
            expense.getSplitType(),
            splits,
            expense.getCreatedAt(),
            expense.getUpdatedAt()
        );
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getTitle() {
        return title != null ? title : description;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public ExpenseCategory getCategory() {
        return category;
    }

    public void setCategory(ExpenseCategory category) {
        this.category = category;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public UserResponse getPaidBy() {
        return paidBy;
    }

    public void setPaidBy(UserResponse paidBy) {
        this.paidBy = paidBy;
    }

    public SplitType getSplitType() {
        return splitType;
    }

    public void setSplitType(SplitType splitType) {
        this.splitType = splitType;
    }

    public List<ExpenseSplitResponse> getSplits() {
        return splits;
    }

    public void setSplits(List<ExpenseSplitResponse> splits) {
        this.splits = splits;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

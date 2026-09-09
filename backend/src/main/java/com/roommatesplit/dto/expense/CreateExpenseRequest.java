package com.roommatesplit.dto.expense;

import com.roommatesplit.enums.ExpenseCategory;
import com.roommatesplit.enums.SplitType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CreateExpenseRequest {

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Expense category is required")
    private ExpenseCategory category;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private SplitType splitType = SplitType.EQUAL;

    @NotEmpty(message = "Splits cannot be empty")
    @Valid
    private List<ExpenseSplitRequest> splits;

    public CreateExpenseRequest() {
    }

    public CreateExpenseRequest(Long roomId, String title, String description, BigDecimal amount,
                                ExpenseCategory category, LocalDate date,
                                SplitType splitType, List<ExpenseSplitRequest> splits) {
        this.roomId = roomId;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.splitType = splitType;
        this.splits = splits;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getTitle() {
        return title != null && !title.trim().isEmpty() ? title.trim() : description;
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

    public SplitType getSplitType() {
        return splitType;
    }

    public void setSplitType(SplitType splitType) {
        this.splitType = splitType;
    }

    public List<ExpenseSplitRequest> getSplits() {
        return splits;
    }

    public void setSplits(List<ExpenseSplitRequest> splits) {
        this.splits = splits;
    }
}

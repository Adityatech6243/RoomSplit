package com.roommatesplit.dto.expense;

import com.roommatesplit.enums.ExpenseCategory;
import com.roommatesplit.enums.SplitType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class UpdateExpenseRequest {

    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    private ExpenseCategory category;
    private LocalDate date;
    private SplitType splitType;

    @Valid
    private List<ExpenseSplitRequest> splits;

    public UpdateExpenseRequest() {
    }

    public UpdateExpenseRequest(String title, String description, BigDecimal amount, ExpenseCategory category,
                                LocalDate date, SplitType splitType, List<ExpenseSplitRequest> splits) {
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.splitType = splitType;
        this.splits = splits;
    }

    public String getTitle() {
        return title;
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

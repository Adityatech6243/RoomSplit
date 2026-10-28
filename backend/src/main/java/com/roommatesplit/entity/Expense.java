package com.roommatesplit.entity;

import com.roommatesplit.enums.ExpenseCategory;
import com.roommatesplit.enums.SplitType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "expenses")
public class Expense {

    @Id
    private String id;

    private String roomId;

    @DocumentReference(lazy = true)
    private Room room;

    private String title;

    private String description;

    private BigDecimal amount;

    private ExpenseCategory category;

    private LocalDate date;

    private String paidById;

    @DocumentReference(lazy = true)
    private User paidBy;

    private SplitType splitType = SplitType.EQUAL;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Expense() {
    }

    public Expense(Room room, String title, String description, BigDecimal amount, ExpenseCategory category, LocalDate date, User paidBy, SplitType splitType) {
        this.room = room;
        this.roomId = room != null ? room.getId() : null;
        this.title = title != null && !title.trim().isEmpty() ? title.trim() : description;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.paidBy = paidBy;
        this.paidById = paidBy != null ? paidBy.getId() : null;
        this.splitType = splitType != null ? splitType : SplitType.EQUAL;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomId() {
        return roomId != null ? roomId : (room != null ? room.getId() : null);
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
        if (room != null) {
            this.roomId = room.getId();
        }
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

    public String getPaidById() {
        return paidById != null ? paidById : (paidBy != null ? paidBy.getId() : null);
    }

    public void setPaidById(String paidById) {
        this.paidById = paidById;
    }

    public User getPaidBy() {
        return paidBy;
    }

    public void setPaidBy(User paidBy) {
        this.paidBy = paidBy;
        if (paidBy != null) {
            this.paidById = paidBy.getId();
        }
    }

    public SplitType getSplitType() {
        return splitType;
    }

    public void setSplitType(SplitType splitType) {
        this.splitType = splitType;
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

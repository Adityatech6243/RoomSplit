package com.roommatesplit.entity;

import com.roommatesplit.enums.RoomRole;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.LocalDateTime;

@Document(collection = "room_members")
@CompoundIndex(def = "{'roomId': 1, 'userId': 1}", unique = true)
public class RoomMember {

    @Id
    private String id;

    private String roomId;

    private String userId;

    @DocumentReference(lazy = true)
    private Room room;

    @DocumentReference(lazy = true)
    private User user;

    private RoomRole role = RoomRole.MEMBER;

    private Boolean isActive = true;

    private LocalDateTime joinedAt;

    public RoomMember() {
    }

    public RoomMember(Room room, User user, RoomRole role) {
        this.room = room;
        this.user = user;
        this.roomId = room != null ? room.getId() : null;
        this.userId = user != null ? user.getId() : null;
        this.role = role != null ? role : RoomRole.MEMBER;
        this.isActive = true;
        this.joinedAt = LocalDateTime.now();
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

    public String getUserId() {
        return userId != null ? userId : (user != null ? user.getId() : null);
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            this.userId = user.getId();
        }
    }

    public RoomRole getRole() {
        return role;
    }

    public void setRole(RoomRole role) {
        this.role = role;
    }

    public Boolean getIsActive() {
        return isActive != null ? isActive : true;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}

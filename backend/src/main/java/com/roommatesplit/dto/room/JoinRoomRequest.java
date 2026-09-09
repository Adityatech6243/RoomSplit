package com.roommatesplit.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class JoinRoomRequest {

    @NotBlank(message = "Room code is required")
    @Size(min = 4, max = 10, message = "Room code must be between 4 and 10 characters")
    private String roomCode;

    public JoinRoomRequest() {
    }

    public JoinRoomRequest(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }
}

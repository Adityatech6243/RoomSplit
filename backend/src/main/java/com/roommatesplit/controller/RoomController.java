package com.roommatesplit.controller;

import com.roommatesplit.dto.room.CreateRoomRequest;
import com.roommatesplit.dto.room.JoinRoomRequest;
import com.roommatesplit.dto.room.RoomMemberResponse;
import com.roommatesplit.dto.room.RoomResponse;
import com.roommatesplit.dto.room.UpdateRoomRequest;
import com.roommatesplit.security.UserPrincipal;
import com.roommatesplit.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @Valid @RequestBody CreateRoomRequest request
    ) {
        RoomResponse response = roomService.createRoom(userPrincipal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/join")
    public ResponseEntity<RoomResponse> joinRoom(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @Valid @RequestBody JoinRoomRequest request
    ) {
        RoomResponse response = roomService.joinRoom(userPrincipal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-rooms")
    public ResponseEntity<List<RoomResponse>> getMyRooms(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<RoomResponse> rooms = roomService.getMyRooms(userPrincipal.getId());
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponse> getRoom(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable String roomId
    ) {
        RoomResponse room = roomService.getRoom(userPrincipal.getId(), roomId);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/{roomId}/members")
    public ResponseEntity<List<RoomMemberResponse>> getRoomMembers(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable String roomId
    ) {
        List<RoomMemberResponse> members = roomService.getRoomMembers(userPrincipal.getId(), roomId);
        return ResponseEntity.ok(members);
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<RoomResponse> updateRoom(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable String roomId,
        @Valid @RequestBody UpdateRoomRequest request
    ) {
        RoomResponse room = roomService.updateRoom(userPrincipal.getId(), roomId, request);
        return ResponseEntity.ok(room);
    }

    @PutMapping("/{roomId}/members/{userId}/status")
    public ResponseEntity<RoomMemberResponse> updateMemberStatus(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable String roomId,
        @PathVariable String userId,
        @RequestParam(required = false, defaultValue = "false") Boolean active
    ) {
        RoomMemberResponse response = roomService.updateMemberStatus(userPrincipal.getId(), roomId, userId, active);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{roomId}/members/{userId}")
    public ResponseEntity<Map<String, String>> removeMember(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable String roomId,
        @PathVariable String userId
    ) {
        roomService.removeMember(userPrincipal.getId(), roomId, userId);
        Map<String, String> result = new HashMap<>();
        result.put("message", "Member removed successfully");
        return ResponseEntity.ok(result);
    }
}

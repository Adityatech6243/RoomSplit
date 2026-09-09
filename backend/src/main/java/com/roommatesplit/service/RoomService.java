package com.roommatesplit.service;

import com.roommatesplit.dto.room.CreateRoomRequest;
import com.roommatesplit.dto.room.JoinRoomRequest;
import com.roommatesplit.dto.room.RoomMemberResponse;
import com.roommatesplit.dto.room.RoomResponse;
import com.roommatesplit.dto.room.UpdateRoomRequest;
import com.roommatesplit.entity.Room;
import com.roommatesplit.entity.RoomMember;
import com.roommatesplit.entity.User;
import com.roommatesplit.enums.RoomRole;
import com.roommatesplit.exception.BadRequestException;
import com.roommatesplit.exception.ForbiddenException;
import com.roommatesplit.exception.ResourceNotFoundException;
import com.roommatesplit.repository.ExpenseRepository;
import com.roommatesplit.repository.RoomMemberRepository;
import com.roommatesplit.repository.RoomRepository;
import com.roommatesplit.repository.UserRepository;
import com.roommatesplit.util.RoomCodeGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    public RoomService(RoomRepository roomRepository,
                       RoomMemberRepository roomMemberRepository,
                       UserRepository userRepository,
                       ExpenseRepository expenseRepository) {
        this.roomRepository = roomRepository;
        this.roomMemberRepository = roomMemberRepository;
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
    }

    @Transactional
    public RoomResponse createRoom(Long userId, CreateRoomRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Generate unique room code
        String roomCode;
        int attempts = 0;
        do {
            roomCode = RoomCodeGenerator.generateCode();
            attempts++;
            if (attempts > 50) {
                throw new RuntimeException("Could not generate a unique room code. Please try again.");
            }
        } while (roomRepository.existsByRoomCode(roomCode));

        Room room = new Room(
            request.getRoomName().trim(),
            roomCode,
            request.getCurrency() != null ? request.getCurrency().trim() : "INR",
            request.getMonthlyBudget() != null ? request.getMonthlyBudget() : BigDecimal.ZERO,
            user
        );

        Room savedRoom = roomRepository.save(room);

        // Creator is added as ADMIN
        RoomMember adminMember = new RoomMember(savedRoom, user, RoomRole.ADMIN);
        roomMemberRepository.save(adminMember);

        return RoomResponse.fromEntity(savedRoom, RoomRole.ADMIN, 1L, BigDecimal.ZERO);
    }

    @Transactional
    public RoomResponse joinRoom(Long userId, JoinRoomRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String code = request.getRoomCode().trim().toUpperCase();
        Room room = roomRepository.findByRoomCode(code)
            .orElseThrow(() -> new ResourceNotFoundException("No active room found with code: " + code));

        var existingMember = roomMemberRepository.findByRoomIdAndUserId(room.getId(), user.getId());
        if (existingMember.isPresent()) {
            RoomMember rm = existingMember.get();
            if (Boolean.FALSE.equals(rm.getIsActive())) {
                rm.setIsActive(true);
                roomMemberRepository.save(rm);
                long memberCount = roomMemberRepository.countByRoomId(room.getId());
                BigDecimal totalExpenses = expenseRepository.sumAmountByRoomId(room.getId());
                return RoomResponse.fromEntity(room, rm.getRole(), memberCount, totalExpenses);
            }
            throw new BadRequestException("You are already a member of this room");
        }

        RoomMember newMember = new RoomMember(room, user, RoomRole.MEMBER);
        roomMemberRepository.save(newMember);

        long memberCount = roomMemberRepository.countByRoomId(room.getId());
        BigDecimal totalExpenses = expenseRepository.sumAmountByRoomId(room.getId());

        return RoomResponse.fromEntity(room, RoomRole.MEMBER, memberCount, totalExpenses);
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getMyRooms(Long userId) {
        List<RoomMember> memberships = roomMemberRepository.findAllByUserId(userId);
        List<RoomResponse> result = new ArrayList<>();

        for (RoomMember rm : memberships) {
            Room room = rm.getRoom();
            long memberCount = roomMemberRepository.countByRoomId(room.getId());
            BigDecimal totalExpenses = expenseRepository.sumAmountByRoomId(room.getId());
            result.add(RoomResponse.fromEntity(room, rm.getRole(), memberCount, totalExpenses));
        }

        return result;
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoom(Long userId, Long roomId) {
        RoomMember membership = roomMemberRepository.findByRoomIdAndUserId(roomId, userId)
            .orElseThrow(() -> new ForbiddenException("You are not an active member of this room"));

        Room room = membership.getRoom();
        long memberCount = roomMemberRepository.countByRoomId(roomId);
        BigDecimal totalExpenses = expenseRepository.sumAmountByRoomId(roomId);

        return RoomResponse.fromEntity(room, membership.getRole(), memberCount, totalExpenses);
    }

    @Transactional(readOnly = true)
    public List<RoomMemberResponse> getRoomMembers(Long userId, Long roomId) {
        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            throw new ForbiddenException("You are not an active member of this room");
        }

        List<RoomMember> members = roomMemberRepository.findAllByRoomIdWithUser(roomId);
        return members.stream()
            .map(RoomMemberResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public RoomResponse updateRoom(Long userId, Long roomId, UpdateRoomRequest request) {
        RoomMember membership = roomMemberRepository.findByRoomIdAndUserId(roomId, userId)
            .orElseThrow(() -> new ForbiddenException("You are not an active member of this room"));

        if (membership.getRole() != RoomRole.ADMIN) {
            throw new ForbiddenException("Only room admins can update room settings");
        }

        Room room = membership.getRoom();
        if (request.getRoomName() != null && !request.getRoomName().trim().isEmpty()) {
            room.setRoomName(request.getRoomName().trim());
        }
        if (request.getCurrency() != null && !request.getCurrency().trim().isEmpty()) {
            room.setCurrency(request.getCurrency().trim());
        }
        if (request.getMonthlyBudget() != null) {
            room.setMonthlyBudget(request.getMonthlyBudget());
        }

        Room savedRoom = roomRepository.save(room);
        long memberCount = roomMemberRepository.countByRoomId(roomId);
        BigDecimal totalExpenses = expenseRepository.sumAmountByRoomId(roomId);

        return RoomResponse.fromEntity(savedRoom, membership.getRole(), memberCount, totalExpenses);
    }

    @Transactional
    public RoomMemberResponse updateMemberStatus(Long currentUserId, Long roomId, Long targetUserId, Boolean active) {
        RoomMember currentMembership = roomMemberRepository.findByRoomIdAndUserId(roomId, currentUserId)
            .orElseThrow(() -> new ForbiddenException("You are not an active member of this room"));

        if (currentMembership.getRole() != RoomRole.ADMIN) {
            throw new ForbiddenException("Only room admins can deactivate or reactivate members");
        }

        RoomMember targetMembership = roomMemberRepository.findByRoomIdAndUserId(roomId, targetUserId)
            .orElseThrow(() -> new ResourceNotFoundException("Member not found in this room"));

        if (currentUserId.equals(targetUserId)) {
            throw new BadRequestException("Admins cannot deactivate their own membership");
        }

        targetMembership.setIsActive(active != null ? active : false);
        RoomMember updated = roomMemberRepository.save(targetMembership);
        return RoomMemberResponse.fromEntity(updated);
    }

    @Transactional
    public void removeMember(Long currentUserId, Long roomId, Long targetUserId) {
        RoomMember currentMembership = roomMemberRepository.findByRoomIdAndUserId(roomId, currentUserId)
            .orElseThrow(() -> new ForbiddenException("You are not an active member of this room"));

        RoomMember targetMembership = roomMemberRepository.findByRoomIdAndUserId(roomId, targetUserId)
            .orElseThrow(() -> new ResourceNotFoundException("Member not found in this room"));

        boolean isSelfLeaving = currentUserId.equals(targetUserId);
        boolean isAdmin = currentMembership.getRole() == RoomRole.ADMIN;

        if (!isSelfLeaving && !isAdmin) {
            throw new ForbiddenException("Only room admins can remove other members");
        }

        roomMemberRepository.deleteByRoomIdAndUserId(roomId, targetUserId);
    }
}

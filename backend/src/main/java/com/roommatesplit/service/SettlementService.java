package com.roommatesplit.service;

import com.roommatesplit.dto.settlement.CreateSettlementRequest;
import com.roommatesplit.dto.settlement.SettlementResponse;
import com.roommatesplit.entity.Room;
import com.roommatesplit.entity.Settlement;
import com.roommatesplit.entity.User;
import com.roommatesplit.enums.SettlementStatus;
import com.roommatesplit.exception.BadRequestException;
import com.roommatesplit.exception.ForbiddenException;
import com.roommatesplit.exception.ResourceNotFoundException;
import com.roommatesplit.repository.RoomMemberRepository;
import com.roommatesplit.repository.RoomRepository;
import com.roommatesplit.repository.SettlementRepository;
import com.roommatesplit.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final UserRepository userRepository;

    public SettlementService(SettlementRepository settlementRepository,
                             RoomRepository roomRepository,
                             RoomMemberRepository roomMemberRepository,
                             UserRepository userRepository) {
        this.settlementRepository = settlementRepository;
        this.roomRepository = roomRepository;
        this.roomMemberRepository = roomMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SettlementResponse createSettlement(String currentUserId, CreateSettlementRequest request) {
        String roomId = request.getRoomId();

        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, currentUserId)) {
            throw new ForbiddenException("You are not an active member of this room");
        }

        if (currentUserId.equals(request.getPaidTo())) {
            throw new BadRequestException("Payer (paidBy) and Payee (paidTo) cannot be the same user");
        }

        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, request.getPaidTo())) {
            throw new BadRequestException("Payee (paidTo) is not an active member of this room");
        }

        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        User paidBy = userRepository.findById(currentUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));

        User paidTo = userRepository.findById(request.getPaidTo())
            .orElseThrow(() -> new ResourceNotFoundException("Recipient user not found with id: " + request.getPaidTo()));

        Settlement settlement = new Settlement(
            room,
            paidBy,
            paidTo,
            request.getAmount().setScale(2, RoundingMode.HALF_UP),
            SettlementStatus.PENDING,
            request.getPaymentMethod() != null ? request.getPaymentMethod().trim() : "CASH",
            request.getNotes() != null ? request.getNotes().trim() : null
        );

        Settlement saved = settlementRepository.save(settlement);
        return SettlementResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<SettlementResponse> getRoomSettlements(String currentUserId, String roomId) {
        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, currentUserId)) {
            throw new ForbiddenException("You are not an active member of this room");
        }

        List<Settlement> settlements = settlementRepository.findAllByRoomIdWithUsersOrderByCreatedAtDesc(roomId);
        return settlements.stream()
            .map(SettlementResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public SettlementResponse markSettled(String currentUserId, String settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
            .orElseThrow(() -> new ResourceNotFoundException("Settlement not found with id: " + settlementId));

        String roomId = settlement.getRoomId();
        if (roomId == null && settlement.getRoom() != null) {
            roomId = settlement.getRoom().getId();
        }

        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, currentUserId)) {
            throw new ForbiddenException("You are not an active member of this room");
        }

        settlement.setStatus(SettlementStatus.SETTLED);
        settlement.setSettledAt(LocalDateTime.now());

        Settlement saved = settlementRepository.save(settlement);
        return SettlementResponse.fromEntity(saved);
    }
}

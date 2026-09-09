package com.roommatesplit.controller;

import com.roommatesplit.dto.settlement.CreateSettlementRequest;
import com.roommatesplit.dto.settlement.SettlementResponse;
import com.roommatesplit.security.UserPrincipal;
import com.roommatesplit.service.SettlementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SettlementController {

    private final SettlementService settlementService;

    public SettlementController(SettlementService settlementService) {
        this.settlementService = settlementService;
    }

    @PostMapping("/settlements")
    public ResponseEntity<SettlementResponse> createSettlement(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @Valid @RequestBody CreateSettlementRequest request
    ) {
        SettlementResponse response = settlementService.createSettlement(userPrincipal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/rooms/{roomId}/settlements")
    public ResponseEntity<List<SettlementResponse>> getRoomSettlements(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable Long roomId
    ) {
        List<SettlementResponse> responses = settlementService.getRoomSettlements(userPrincipal.getId(), roomId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/settlements/{settlementId}/settled")
    public ResponseEntity<SettlementResponse> markSettled(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable Long settlementId
    ) {
        SettlementResponse response = settlementService.markSettled(userPrincipal.getId(), settlementId);
        return ResponseEntity.ok(response);
    }
}

package com.roommatesplit.controller;

import com.roommatesplit.dto.balance.RoomBalanceResponse;
import com.roommatesplit.security.UserPrincipal;
import com.roommatesplit.service.BalanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms")
public class BalanceController {

    private final BalanceService balanceService;

    public BalanceController(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    @GetMapping("/{roomId}/balances")
    public ResponseEntity<RoomBalanceResponse> getRoomBalances(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable String roomId
    ) {
        RoomBalanceResponse response = balanceService.getRoomBalances(userPrincipal.getId(), roomId);
        return ResponseEntity.ok(response);
    }
}

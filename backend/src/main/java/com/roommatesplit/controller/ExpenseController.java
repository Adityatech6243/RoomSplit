package com.roommatesplit.controller;

import com.roommatesplit.dto.expense.CreateExpenseRequest;
import com.roommatesplit.dto.expense.ExpenseResponse;
import com.roommatesplit.dto.expense.UpdateExpenseRequest;
import com.roommatesplit.enums.ExpenseCategory;
import com.roommatesplit.security.UserPrincipal;
import com.roommatesplit.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/expenses")
    public ResponseEntity<ExpenseResponse> createExpense(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @Valid @RequestBody CreateExpenseRequest request
    ) {
        ExpenseResponse response = expenseService.createExpense(userPrincipal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/expenses/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpense(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable Long expenseId
    ) {
        ExpenseResponse response = expenseService.getExpense(userPrincipal.getId(), expenseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rooms/{roomId}/expenses")
    public ResponseEntity<List<ExpenseResponse>> getRoomExpenses(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable Long roomId,
        @RequestParam(required = false) ExpenseCategory category,
        @RequestParam(required = false) Long paidById
    ) {
        List<ExpenseResponse> expenses = expenseService.getRoomExpenses(userPrincipal.getId(), roomId, category, paidById);
        return ResponseEntity.ok(expenses);
    }

    @PutMapping("/expenses/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable Long expenseId,
        @Valid @RequestBody UpdateExpenseRequest request
    ) {
        ExpenseResponse response = expenseService.updateExpense(userPrincipal.getId(), expenseId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/expenses/{expenseId}")
    public ResponseEntity<Map<String, String>> deleteExpense(
        @AuthenticationPrincipal UserPrincipal userPrincipal,
        @PathVariable Long expenseId
    ) {
        expenseService.deleteExpense(userPrincipal.getId(), expenseId);
        Map<String, String> result = new HashMap<>();
        result.put("message", "Expense deleted successfully");
        return ResponseEntity.ok(result);
    }
}

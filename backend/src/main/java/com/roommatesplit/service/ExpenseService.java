package com.roommatesplit.service;

import com.roommatesplit.dto.expense.CreateExpenseRequest;
import com.roommatesplit.dto.expense.ExpenseResponse;
import com.roommatesplit.dto.expense.ExpenseSplitRequest;
import com.roommatesplit.dto.expense.ExpenseSplitResponse;
import com.roommatesplit.dto.expense.UpdateExpenseRequest;
import com.roommatesplit.entity.Expense;
import com.roommatesplit.entity.ExpenseSplit;
import com.roommatesplit.entity.Room;
import com.roommatesplit.entity.User;
import com.roommatesplit.enums.ExpenseCategory;
import com.roommatesplit.enums.SplitType;
import com.roommatesplit.exception.BadRequestException;
import com.roommatesplit.exception.ForbiddenException;
import com.roommatesplit.exception.ResourceNotFoundException;
import com.roommatesplit.repository.ExpenseRepository;
import com.roommatesplit.repository.ExpenseSplitRepository;
import com.roommatesplit.repository.RoomMemberRepository;
import com.roommatesplit.repository.RoomRepository;
import com.roommatesplit.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository,
                          ExpenseSplitRepository expenseSplitRepository,
                          RoomRepository roomRepository,
                          RoomMemberRepository roomMemberRepository,
                          UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.expenseSplitRepository = expenseSplitRepository;
        this.roomRepository = roomRepository;
        this.roomMemberRepository = roomMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ExpenseResponse createExpense(String currentUserId, CreateExpenseRequest request) {
        // Validate active membership
        if (!roomMemberRepository.existsByRoomIdAndUserId(request.getRoomId(), currentUserId)) {
            throw new ForbiddenException("You are not an active member of this room");
        }

        Room room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        User payer = userRepository.findById(currentUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));

        // Validate splits & participants
        validateSplits(request.getRoomId(), request.getAmount(), request.getSplits());

        String title = request.getTitle() != null && !request.getTitle().trim().isEmpty() 
            ? request.getTitle().trim() 
            : request.getDescription();
        String desc = request.getDescription() != null ? request.getDescription().trim() : null;

        Expense expense = new Expense(
            room,
            title,
            desc,
            request.getAmount().setScale(2, RoundingMode.HALF_UP),
            request.getCategory(),
            request.getDate(),
            payer,
            request.getSplitType() != null ? request.getSplitType() : SplitType.EQUAL
        );

        Expense savedExpense = expenseRepository.save(expense);

        List<ExpenseSplit> createdSplits = new ArrayList<>();
        for (ExpenseSplitRequest sr : request.getSplits()) {
            User participant = userRepository.findById(sr.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Participant user not found with id: " + sr.getUserId()));
            ExpenseSplit split = new ExpenseSplit(savedExpense, participant, sr.getShareAmount().setScale(2, RoundingMode.HALF_UP));
            createdSplits.add(expenseSplitRepository.save(split));
        }

        List<ExpenseSplitResponse> splitResponses = createdSplits.stream()
            .map(ExpenseSplitResponse::fromEntity)
            .collect(Collectors.toList());

        return ExpenseResponse.fromEntity(savedExpense, splitResponses);
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpense(String currentUserId, String expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        if (!roomMemberRepository.existsByRoomIdAndUserId(expense.getRoomId(), currentUserId)) {
            throw new ForbiddenException("You do not have access to view this expense");
        }

        List<ExpenseSplit> splits = expenseSplitRepository.findAllByExpenseIdWithUser(expenseId);
        List<ExpenseSplitResponse> splitResponses = splits.stream()
            .map(ExpenseSplitResponse::fromEntity)
            .collect(Collectors.toList());

        return ExpenseResponse.fromEntity(expense, splitResponses);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getRoomExpenses(String currentUserId, String roomId, ExpenseCategory category, String paidById) {
        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, currentUserId)) {
            throw new ForbiddenException("You are not an active member of this room");
        }

        List<Expense> expenses;
        if (category != null) {
            expenses = expenseRepository.findAllByRoomIdAndCategoryOrderByDateDescIdDesc(roomId, category);
        } else if (paidById != null) {
            expenses = expenseRepository.findAllByRoomIdAndPaidByIdOrderByDateDescIdDesc(roomId, paidById);
        } else {
            expenses = expenseRepository.findAllByRoomIdOrderByDateDescIdDesc(roomId);
        }

        List<ExpenseResponse> result = new ArrayList<>();
        for (Expense e : expenses) {
            List<ExpenseSplit> splits = expenseSplitRepository.findAllByExpenseIdWithUser(e.getId());
            List<ExpenseSplitResponse> splitResponses = splits.stream()
                .map(ExpenseSplitResponse::fromEntity)
                .collect(Collectors.toList());
            result.add(ExpenseResponse.fromEntity(e, splitResponses));
        }

        return result;
    }

    @Transactional
    public ExpenseResponse updateExpense(String currentUserId, String expenseId, UpdateExpenseRequest request) {
        Expense expense = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        String paidByUserId = expense.getPaidById();
        if (paidByUserId == null && expense.getPaidBy() != null) {
            paidByUserId = expense.getPaidBy().getId();
        }

        if (paidByUserId != null && !paidByUserId.equals(currentUserId)) {
            throw new ForbiddenException("Only the expense creator can edit this expense");
        }

        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            expense.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            expense.setDescription(request.getDescription().trim());
        }
        if (request.getAmount() != null) {
            expense.setAmount(request.getAmount().setScale(2, RoundingMode.HALF_UP));
        }
        if (request.getCategory() != null) {
            expense.setCategory(request.getCategory());
        }
        if (request.getDate() != null) {
            expense.setDate(request.getDate());
        }
        if (request.getSplitType() != null) {
            expense.setSplitType(request.getSplitType());
        }

        if (request.getSplits() != null && !request.getSplits().isEmpty()) {
            BigDecimal effectiveAmount = request.getAmount() != null ? request.getAmount() : expense.getAmount();
            validateSplits(expense.getRoomId(), effectiveAmount, request.getSplits());

            expenseSplitRepository.deleteAllByExpenseId(expense.getId());

            List<ExpenseSplit> updatedSplits = new ArrayList<>();
            for (ExpenseSplitRequest sr : request.getSplits()) {
                User participant = userRepository.findById(sr.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Participant user not found with id: " + sr.getUserId()));
                ExpenseSplit split = new ExpenseSplit(expense, participant, sr.getShareAmount().setScale(2, RoundingMode.HALF_UP));
                updatedSplits.add(expenseSplitRepository.save(split));
            }

            Expense savedExpense = expenseRepository.save(expense);
            List<ExpenseSplitResponse> splitResponses = updatedSplits.stream()
                .map(ExpenseSplitResponse::fromEntity)
                .collect(Collectors.toList());

            return ExpenseResponse.fromEntity(savedExpense, splitResponses);
        }

        Expense savedExpense = expenseRepository.save(expense);
        List<ExpenseSplit> splits = expenseSplitRepository.findAllByExpenseIdWithUser(expense.getId());
        List<ExpenseSplitResponse> splitResponses = splits.stream()
                .map(ExpenseSplitResponse::fromEntity)
                .collect(Collectors.toList());

        return ExpenseResponse.fromEntity(savedExpense, splitResponses);
    }

    @Transactional
    public void deleteExpense(String currentUserId, String expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        String paidByUserId = expense.getPaidById();
        if (paidByUserId == null && expense.getPaidBy() != null) {
            paidByUserId = expense.getPaidBy().getId();
        }

        if (paidByUserId != null && !paidByUserId.equals(currentUserId)) {
            throw new ForbiddenException("Only the expense creator can delete this expense");
        }

        expenseSplitRepository.deleteAllByExpenseId(expenseId);
        expenseRepository.deleteById(expenseId);
    }

    private void validateSplits(String roomId, BigDecimal totalAmount, List<ExpenseSplitRequest> splits) {
        if (splits == null || splits.isEmpty()) {
            throw new BadRequestException("At least one split participant is required");
        }

        BigDecimal splitSum = BigDecimal.ZERO;
        for (ExpenseSplitRequest s : splits) {
            if (s.getUserId() == null || s.getShareAmount() == null) {
                throw new BadRequestException("Each split must specify userId and shareAmount");
            }

            if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, s.getUserId())) {
                throw new BadRequestException("User " + s.getUserId() + " is not an active member of this room");
            }

            if (s.getShareAmount().compareTo(BigDecimal.ZERO) < 0) {
                throw new BadRequestException("Share amount cannot be negative");
            }

            splitSum = splitSum.add(s.getShareAmount());
        }

        BigDecimal scaledTotal = totalAmount.setScale(2, RoundingMode.HALF_UP);
        BigDecimal scaledSplitSum = splitSum.setScale(2, RoundingMode.HALF_UP);

        BigDecimal difference = scaledTotal.subtract(scaledSplitSum).abs();
        if (difference.compareTo(BigDecimal.valueOf(0.05)) > 0) {
            throw new BadRequestException(
                String.format("Sum of split shares (Rs. %s) does not match total expense amount (Rs. %s)",
                    scaledSplitSum, scaledTotal)
            );
        }
    }
}

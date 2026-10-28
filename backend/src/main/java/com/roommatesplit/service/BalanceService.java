package com.roommatesplit.service;

import com.roommatesplit.dto.balance.MemberBalanceResponse;
import com.roommatesplit.dto.balance.RoomBalanceResponse;
import com.roommatesplit.dto.balance.SettlementSuggestionResponse;
import com.roommatesplit.entity.RoomMember;
import com.roommatesplit.entity.User;
import com.roommatesplit.exception.ForbiddenException;
import com.roommatesplit.repository.ExpenseRepository;
import com.roommatesplit.repository.ExpenseSplitRepository;
import com.roommatesplit.repository.RoomMemberRepository;
import com.roommatesplit.repository.SettlementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class BalanceService {

    private final RoomMemberRepository roomMemberRepository;
    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final SettlementRepository settlementRepository;

    public BalanceService(RoomMemberRepository roomMemberRepository,
                          ExpenseRepository expenseRepository,
                          ExpenseSplitRepository expenseSplitRepository,
                          SettlementRepository settlementRepository) {
        this.roomMemberRepository = roomMemberRepository;
        this.expenseRepository = expenseRepository;
        this.expenseSplitRepository = expenseSplitRepository;
        this.settlementRepository = settlementRepository;
    }

    private static class DebtNode {
        String userId;
        String name;
        BigDecimal amount;

        DebtNode(String userId, String name, BigDecimal amount) {
            this.userId = userId;
            this.name = name;
            this.amount = amount;
        }
    }

    @Transactional(readOnly = true)
    public RoomBalanceResponse getRoomBalances(String currentUserId, String roomId) {
        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, currentUserId)) {
            throw new ForbiddenException("You are not an active member of this room");
        }

        List<RoomMember> members = roomMemberRepository.findAllByRoomIdWithUser(roomId);
        List<MemberBalanceResponse> balanceList = new ArrayList<>();

        List<DebtNode> debtors = new ArrayList<>();
        List<DebtNode> creditors = new ArrayList<>();

        for (RoomMember rm : members) {
            User user = rm.getUser();
            String uid = rm.getUserId();
            String userName = user != null ? user.getName() : "Unknown";
            String userEmail = user != null ? user.getEmail() : "";
            String userAvatar = user != null ? user.getAvatar() : null;

            BigDecimal totalPaid = expenseRepository.sumAmountByRoomIdAndPaidById(roomId, uid)
                .setScale(2, RoundingMode.HALF_UP);

            BigDecimal totalOwed = expenseSplitRepository.sumShareAmountByRoomIdAndUserId(roomId, uid)
                .setScale(2, RoundingMode.HALF_UP);

            BigDecimal settledPaid = settlementRepository.sumSettledAmountPaidBy(roomId, uid)
                .setScale(2, RoundingMode.HALF_UP);

            BigDecimal settledReceived = settlementRepository.sumSettledAmountReceivedBy(roomId, uid)
                .setScale(2, RoundingMode.HALF_UP);

            // Final Balance = Contribution - Assigned Share + SettledPaid - SettledReceived
            BigDecimal netBalance = totalPaid.subtract(totalOwed).add(settledPaid).subtract(settledReceived)
                .setScale(2, RoundingMode.HALF_UP);

            balanceList.add(new MemberBalanceResponse(
                uid,
                userName,
                userEmail,
                userAvatar,
                totalPaid,
                totalOwed,
                netBalance
            ));

            if (netBalance.compareTo(BigDecimal.valueOf(0.01)) > 0) {
                creditors.add(new DebtNode(uid, userName, netBalance));
            } else if (netBalance.compareTo(BigDecimal.valueOf(-0.01)) < 0) {
                debtors.add(new DebtNode(uid, userName, netBalance.negate()));
            }
        }

        // Greedy Debt Simplification Algorithm
        List<SettlementSuggestionResponse> suggestions = simplifyDebts(debtors, creditors);

        return new RoomBalanceResponse(balanceList, suggestions);
    }

    private List<SettlementSuggestionResponse> simplifyDebts(List<DebtNode> debtors, List<DebtNode> creditors) {
        List<SettlementSuggestionResponse> result = new ArrayList<>();

        int dIdx = 0;
        int cIdx = 0;

        while (dIdx < debtors.size() && cIdx < creditors.size()) {
            DebtNode debtor = debtors.get(dIdx);
            DebtNode creditor = creditors.get(cIdx);

            BigDecimal settleAmount = debtor.amount.min(creditor.amount).setScale(2, RoundingMode.HALF_UP);

            if (settleAmount.compareTo(BigDecimal.ZERO) > 0) {
                result.add(new SettlementSuggestionResponse(
                    debtor.userId,
                    debtor.name,
                    creditor.userId,
                    creditor.name,
                    settleAmount
                ));
            }

            debtor.amount = debtor.amount.subtract(settleAmount);
            creditor.amount = creditor.amount.subtract(settleAmount);

            if (debtor.amount.compareTo(BigDecimal.valueOf(0.01)) < 0) {
                dIdx++;
            }
            if (creditor.amount.compareTo(BigDecimal.valueOf(0.01)) < 0) {
                cIdx++;
            }
        }

        return result;
    }
}

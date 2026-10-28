package com.roommatesplit.repository;

import com.roommatesplit.entity.Expense;
import com.roommatesplit.enums.ExpenseCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {

    List<Expense> findAllByRoomIdOrderByDateDescIdDesc(String roomId);

    List<Expense> findAllByRoomIdAndCategoryOrderByDateDescIdDesc(String roomId, ExpenseCategory category);

    List<Expense> findAllByRoomIdAndPaidByIdOrderByDateDescIdDesc(String roomId, String paidById);

    default BigDecimal sumAmountByRoomId(String roomId) {
        return findAllByRoomIdOrderByDateDescIdDesc(roomId).stream()
            .map(Expense::getAmount)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    default BigDecimal sumAmountByRoomIdAndPaidById(String roomId, String userId) {
        return findAllByRoomIdAndPaidByIdOrderByDateDescIdDesc(roomId, userId).stream()
            .map(Expense::getAmount)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

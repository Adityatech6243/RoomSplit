package com.roommatesplit.repository;

import com.roommatesplit.entity.ExpenseSplit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Repository
public interface ExpenseSplitRepository extends MongoRepository<ExpenseSplit, String> {

    List<ExpenseSplit> findAllByExpenseId(String expenseId);

    default List<ExpenseSplit> findAllByExpenseIdWithUser(String expenseId) {
        return findAllByExpenseId(expenseId);
    }

    void deleteAllByExpenseId(String expenseId);

    List<ExpenseSplit> findAllByRoomId(String roomId);

    List<ExpenseSplit> findAllByRoomIdAndUserId(String roomId, String userId);

    default BigDecimal sumShareAmountByRoomIdAndUserId(String roomId, String userId) {
        return findAllByRoomIdAndUserId(roomId, userId).stream()
            .map(ExpenseSplit::getShareAmount)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

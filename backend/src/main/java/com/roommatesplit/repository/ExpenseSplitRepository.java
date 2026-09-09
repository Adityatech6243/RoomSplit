package com.roommatesplit.repository;

import com.roommatesplit.entity.ExpenseSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {

    @Query("SELECT es FROM ExpenseSplit es JOIN FETCH es.user WHERE es.expense.id = :expenseId")
    List<ExpenseSplit> findAllByExpenseIdWithUser(@Param("expenseId") Long expenseId);

    List<ExpenseSplit> findAllByExpenseId(Long expenseId);

    void deleteAllByExpenseId(Long expenseId);

    @Query("SELECT es FROM ExpenseSplit es JOIN FETCH es.expense e JOIN FETCH es.user u WHERE e.room.id = :roomId")
    List<ExpenseSplit> findAllByRoomId(@Param("roomId") Long roomId);

    @Query("SELECT COALESCE(SUM(es.shareAmount), 0) FROM ExpenseSplit es JOIN es.expense e WHERE e.room.id = :roomId AND es.user.id = :userId")
    BigDecimal sumShareAmountByRoomIdAndUserId(@Param("roomId") Long roomId, @Param("userId") Long userId);
}

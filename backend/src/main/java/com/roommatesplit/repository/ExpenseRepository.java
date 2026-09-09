package com.roommatesplit.repository;

import com.roommatesplit.entity.Expense;
import com.roommatesplit.entity.Room;
import com.roommatesplit.enums.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByRoomIdOrderByDateDescIdDesc(Long roomId);

    List<Expense> findAllByRoomIdAndCategoryOrderByDateDescIdDesc(Long roomId, ExpenseCategory category);

    List<Expense> findAllByRoomIdAndPaidByIdOrderByDateDescIdDesc(Long roomId, Long paidById);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.room.id = :roomId")
    BigDecimal sumAmountByRoomId(@Param("roomId") Long roomId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.room.id = :roomId AND e.paidBy.id = :userId")
    BigDecimal sumAmountByRoomIdAndPaidById(@Param("roomId") Long roomId, @Param("userId") Long userId);
}

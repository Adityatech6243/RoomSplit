package com.roommatesplit.repository;

import com.roommatesplit.entity.Settlement;
import com.roommatesplit.enums.SettlementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {

    @Query("SELECT s FROM Settlement s JOIN FETCH s.paidBy JOIN FETCH s.paidTo WHERE s.room.id = :roomId ORDER BY s.createdAt DESC")
    List<Settlement> findAllByRoomIdWithUsersOrderByCreatedAtDesc(@Param("roomId") Long roomId);

    List<Settlement> findAllByRoomIdAndStatus(Long roomId, SettlementStatus status);

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Settlement s WHERE s.room.id = :roomId AND s.paidBy.id = :userId AND s.status = 'SETTLED'")
    BigDecimal sumSettledAmountPaidBy(@Param("roomId") Long roomId, @Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Settlement s WHERE s.room.id = :roomId AND s.paidTo.id = :userId AND s.status = 'SETTLED'")
    BigDecimal sumSettledAmountReceivedBy(@Param("roomId") Long roomId, @Param("userId") Long userId);
}

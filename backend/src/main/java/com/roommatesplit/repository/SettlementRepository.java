package com.roommatesplit.repository;

import com.roommatesplit.entity.Settlement;
import com.roommatesplit.enums.SettlementStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Repository
public interface SettlementRepository extends MongoRepository<Settlement, String> {

    List<Settlement> findAllByRoomIdOrderByCreatedAtDesc(String roomId);

    default List<Settlement> findAllByRoomIdWithUsersOrderByCreatedAtDesc(String roomId) {
        return findAllByRoomIdOrderByCreatedAtDesc(roomId);
    }

    List<Settlement> findAllByRoomIdAndStatus(String roomId, SettlementStatus status);

    default BigDecimal sumSettledAmountPaidBy(String roomId, String userId) {
        return findAllByRoomIdAndStatus(roomId, SettlementStatus.SETTLED).stream()
            .filter(s -> (s.getPaidById() != null && s.getPaidById().equals(userId))
                || (s.getPaidBy() != null && userId.equals(s.getPaidBy().getId())))
            .map(Settlement::getAmount)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    default BigDecimal sumSettledAmountReceivedBy(String roomId, String userId) {
        return findAllByRoomIdAndStatus(roomId, SettlementStatus.SETTLED).stream()
            .filter(s -> (s.getPaidToId() != null && s.getPaidToId().equals(userId))
                || (s.getPaidTo() != null && userId.equals(s.getPaidTo().getId())))
            .map(Settlement::getAmount)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

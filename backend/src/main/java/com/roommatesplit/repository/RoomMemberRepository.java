package com.roommatesplit.repository;

import com.roommatesplit.entity.RoomMember;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomMemberRepository extends MongoRepository<RoomMember, String> {

    Optional<RoomMember> findByRoomIdAndUserId(String roomId, String userId);

    boolean existsByRoomIdAndUserId(String roomId, String userId);

    List<RoomMember> findAllByUserId(String userId);

    List<RoomMember> findAllByRoomId(String roomId);

    default List<RoomMember> findAllByRoomIdWithUser(String roomId) {
        return findAllByRoomId(roomId);
    }

    void deleteByRoomIdAndUserId(String roomId, String userId);

    long countByRoomId(String roomId);
}

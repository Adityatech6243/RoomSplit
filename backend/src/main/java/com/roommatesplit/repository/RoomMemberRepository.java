package com.roommatesplit.repository;

import com.roommatesplit.entity.Room;
import com.roommatesplit.entity.RoomMember;
import com.roommatesplit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {

    Optional<RoomMember> findByRoomAndUser(Room room, User user);

    Optional<RoomMember> findByRoomIdAndUserId(Long roomId, Long userId);

    boolean existsByRoomAndUser(Room room, User user);

    boolean existsByRoomIdAndUserId(Long roomId, Long userId);

    List<RoomMember> findAllByUser(User user);

    List<RoomMember> findAllByUserId(Long userId);

    @Query("SELECT rm FROM RoomMember rm JOIN FETCH rm.user WHERE rm.room.id = :roomId")
    List<RoomMember> findAllByRoomIdWithUser(@Param("roomId") Long roomId);

    List<RoomMember> findAllByRoomId(Long roomId);

    void deleteByRoomIdAndUserId(Long roomId, Long userId);

    long countByRoomId(Long roomId);
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { roomService } from '../services/roomService';
import { useAuth } from './AuthContext';

const RoomContext = createContext(null);

export const RoomProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [myRooms, setMyRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const refreshRooms = useCallback(async () => {
    if (!isAuthenticated) {
      setMyRooms([]);
      setActiveRoom(null);
      return;
    }

    setLoadingRooms(true);
    try {
      const rooms = await roomService.getMyRooms();
      setMyRooms(rooms);

      // Restore previously saved room or select the first available
      const savedRoomId = localStorage.getItem('roomsplit_active_room_id');
      const found = rooms.find(r => String(r.id) === String(savedRoomId));

      if (found) {
        setActiveRoom(found);
      } else if (rooms.length > 0) {
        setActiveRoom(rooms[0]);
        localStorage.setItem('roomsplit_active_room_id', rooms[0].id);
      } else {
        setActiveRoom(null);
      }
    } catch (err) {
      console.error('Failed to load user rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshRooms();
  }, [refreshRooms]);

  const switchRoom = useCallback((roomId) => {
    const found = myRooms.find(r => String(r.id) === String(roomId));
    if (found) {
      setActiveRoom(found);
      localStorage.setItem('roomsplit_active_room_id', found.id);
    }
  }, [myRooms]);

  const updateActiveRoom = useCallback((updatedRoom) => {
    setActiveRoom(prev => ({ ...prev, ...updatedRoom }));
    setMyRooms(prev => prev.map(r => String(r.id) === String(updatedRoom.id) ? { ...r, ...updatedRoom } : r));
  }, []);

  const value = {
    myRooms,
    activeRoom,
    loadingRooms,
    switchRoom,
    refreshRooms,
    updateActiveRoom
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};

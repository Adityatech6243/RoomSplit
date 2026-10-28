import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { roomService } from '../services/roomService';
import { useAuth } from './AuthContext';

const RoomContext = createContext(null);

// ── cache helpers ─────────────────────────────────────────────────────────────
const CACHE_KEY_ROOMS   = 'roomsplit_cached_rooms';
const CACHE_KEY_ROOM_ID = 'roomsplit_active_room_id';

const readCachedRooms = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY_ROOMS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const persistRooms = (rooms) => {
  try { localStorage.setItem(CACHE_KEY_ROOMS, JSON.stringify(rooms)); } catch {}
};

const resolveActiveRoom = (rooms) => {
  const savedId = localStorage.getItem(CACHE_KEY_ROOM_ID);
  return rooms.find(r => String(r.id) === String(savedId)) || rooms[0] || null;
};

// ── provider ─────────────────────────────────────────────────────────────────
export const RoomProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Initialise synchronously from cache — no API wait
  const cachedRooms   = isAuthenticated ? readCachedRooms() : [];
  const [myRooms,    setMyRooms]    = useState(cachedRooms);
  const [activeRoom, setActiveRoom] = useState(resolveActiveRoom(cachedRooms));
  // loadingRooms only true when we have NO cached data yet
  const [loadingRooms, setLoadingRooms] = useState(cachedRooms.length === 0 && isAuthenticated);

  const refreshRooms = useCallback(async () => {
    if (!isAuthenticated) {
      setMyRooms([]);
      setActiveRoom(null);
      return;
    }

    // Only show loading spinner when we have nothing cached yet
    const hasCached = readCachedRooms().length > 0;
    if (!hasCached) setLoadingRooms(true);

    try {
      const rooms = await roomService.getMyRooms();
      persistRooms(rooms);
      setMyRooms(rooms);

      const savedId = localStorage.getItem(CACHE_KEY_ROOM_ID);
      const found   = rooms.find(r => String(r.id) === String(savedId));

      if (found) {
        setActiveRoom(found);
      } else if (rooms.length > 0) {
        setActiveRoom(rooms[0]);
        localStorage.setItem(CACHE_KEY_ROOM_ID, rooms[0].id);
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
    if (isAuthenticated) refreshRooms();
  }, [isAuthenticated, refreshRooms]);

  const switchRoom = useCallback((roomId) => {
    const found = myRooms.find(r => String(r.id) === String(roomId));
    if (found) {
      setActiveRoom(found);
      localStorage.setItem(CACHE_KEY_ROOM_ID, found.id);
    }
  }, [myRooms]);

  const updateActiveRoom = useCallback((updatedRoom) => {
    setActiveRoom(prev => {
      const merged = { ...prev, ...updatedRoom };
      // Keep cache in sync
      setMyRooms(prev2 => {
        const updated = prev2.map(r => String(r.id) === String(updatedRoom.id) ? { ...r, ...updatedRoom } : r);
        persistRooms(updated);
        return updated;
      });
      return merged;
    });
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
  if (!context) throw new Error('useRoom must be used within a RoomProvider');
  return context;
};

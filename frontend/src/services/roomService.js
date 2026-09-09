import api from './api';

const normalizeRoom = (room) => {
  if (!room) return null;
  const role = room.currentUserRole || room.role || 'MEMBER';
  return {
    ...room,
    role,
    currentUserRole: role
  };
};

export const roomService = {
  async getMyRooms() {
    const response = await api.get('/rooms/my-rooms');
    const data = response.data || [];
    return data.map(normalizeRoom);
  },

  async getRoom(roomId) {
    const response = await api.get(`/rooms/${roomId}`);
    return normalizeRoom(response.data);
  },

  async getRoomMembers(roomId) {
    const response = await api.get(`/rooms/${roomId}/members`);
    const data = response.data || [];
    return data.map(m => ({
      id: m.id,
      userId: m.user ? m.user.id : m.userId,
      name: m.user ? m.user.name : (m.name || m.userName),
      email: m.user ? m.user.email : m.email,
      phone: m.user ? m.user.phone : m.phone,
      avatar: m.user ? m.user.avatar : m.avatar,
      role: m.role,
      joinedAt: m.joinedAt
    }));
  },

  async createRoom(roomData) {
    const response = await api.post('/rooms', {
      roomName: roomData.roomName.trim(),
      currency: roomData.currency || 'INR',
      monthlyBudget: Number(roomData.monthlyBudget) || 0
    });
    return normalizeRoom(response.data);
  },

  async joinRoom(joinData) {
    const response = await api.post('/rooms/join', {
      roomCode: joinData.roomCode.trim().toUpperCase()
    });
    return normalizeRoom(response.data);
  },

  async updateRoom(roomId, roomData) {
    const response = await api.put(`/rooms/${roomId}`, {
      roomName: roomData.roomName ? roomData.roomName.trim() : undefined,
      currency: roomData.currency,
      monthlyBudget: roomData.monthlyBudget !== undefined ? Number(roomData.monthlyBudget) : undefined
    });
    return normalizeRoom(response.data);
  },

  async removeMember(roomId, userId) {
    const response = await api.delete(`/rooms/${roomId}/members/${userId}`);
    return response.data;
  }
};

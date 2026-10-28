import api from './api';

const normalizeSettlement = (s) => {
  if (!s) return null;
  return {
    ...s,
    fromUserId: s.paidBy ? s.paidBy.id : s.fromUserId,
    fromUserName: s.paidBy ? s.paidBy.name : (s.fromUserName || s.paidByName),
    toUserId: s.paidTo ? s.paidTo.id : s.toUserId,
    toUserName: s.paidTo ? s.paidTo.name : (s.toUserName || s.paidToName),
    date: s.settledAt || s.createdAt || s.date,
    amount: Number(s.amount)
  };
};

export const settlementService = {
  async getRoomSettlements(roomId) {
    const response = await api.get(`/rooms/${roomId}/settlements`);
    const data = response.data || [];
    return data.map(normalizeSettlement);
  },

  async createSettlement(settlementData) {
    const response = await api.post('/settlements', {
      roomId: settlementData.roomId,
      paidTo: settlementData.paidTo || settlementData.toUserId,
      amount: Number(settlementData.amount),
      paymentMethod: settlementData.paymentMethod || 'CASH',
      notes: settlementData.notes ? settlementData.notes.trim() : null
    });
    return normalizeSettlement(response.data);
  },

  async markSettled(settlementId) {
    const response = await api.put(`/settlements/${settlementId}/settled`);
    return normalizeSettlement(response.data);
  }
};

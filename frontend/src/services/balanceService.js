import api from './api';

export const balanceService = {
  async getRoomBalances(roomId) {
    const response = await api.get(`/rooms/${roomId}/balances`);
    const data = response.data || {};
    const debts = (data.simplifiedDebts || data.suggestions || []).map(d => ({
      fromUserId: d.fromUserId,
      fromUserName: d.fromUserName,
      toUserId: d.toUserId,
      toUserName: d.toUserName,
      amount: Number(d.amount)
    }));

    const balances = (data.balances || []).map(b => {
      const net = Number(b.netBalance !== undefined ? b.netBalance : (b.finalBalance || 0));
      const owed = Number(b.totalOwed !== undefined ? b.totalOwed : (b.totalShare || 0));
      const paid = Number(b.totalPaid || 0);

      return {
        userId: b.userId,
        name: b.name || b.userName,
        userName: b.name || b.userName,
        email: b.email,
        avatar: b.avatar,
        totalPaid: paid,
        totalOwed: owed,
        totalShare: owed,
        settledPaid: Number(b.settledPaid || 0),
        settledReceived: Number(b.settledReceived || 0),
        finalBalance: net,
        netBalance: net
      };
    });

    return {
      balances,
      simplifiedDebts: debts,
      suggestions: debts
    };
  }
};

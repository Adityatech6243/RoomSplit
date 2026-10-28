import api from './api';
import { normalizeCategory } from '../constants/categories';

const normalizeExpense = (expense) => {
  if (!expense) return null;
  const payerId = expense.paidBy ? expense.paidBy.id : (expense.payerId || expense.paidById);
  const payerName = expense.paidBy ? expense.paidBy.name : (expense.payerName || expense.paidByName);
  const title = expense.title && expense.title.trim().length > 0 ? expense.title : (expense.description || 'Expense');
  const description = expense.description || '';

  return {
    ...expense,
    title,
    description,
    expenseDate: expense.date || expense.expenseDate || expense.createdAt,
    date: expense.date || expense.expenseDate || expense.createdAt,
    amount: Number(expense.amount),
    payerId,
    payerName,
    paidBy: {
      id: payerId,
      name: payerName,
      email: expense.paidBy?.email
    },
    splits: (expense.splits || []).map(s => {
      const uId = s.user ? s.user.id : (s.userId || s.id);
      const uName = s.user ? s.user.name : (s.userName || s.name || 'Roommate');
      const share = Number(s.shareAmount !== undefined ? s.shareAmount : (s.amount || 0));
      return {
        id: s.id,
        userId: uId,
        userName: uName,
        name: uName,
        shareAmount: share,
        amount: share
      };
    })
  };
};

export const expenseService = {
  async getRoomExpenses(roomId, category, paidById) {
    let url = `/rooms/${roomId}/expenses`;
    const params = [];
    if (category && category !== 'ALL') params.push(`category=${encodeURIComponent(category)}`);
    if (paidById) params.push(`paidById=${encodeURIComponent(paidById)}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    const response = await api.get(url);
    const data = response.data || [];
    return data.map(normalizeExpense);
  },

  async getExpense(expenseId) {
    const response = await api.get(`/expenses/${expenseId}`);
    return normalizeExpense(response.data);
  },

  async createExpense(arg1, arg2) {
    // Supports createExpense(roomId, data) OR createExpense(data)
    const payload = arg2 ? { ...arg2, roomId: arg1 } : arg1;
    const splitsPayload = (payload.splits || []).map(s => ({
      userId: s.userId,
      shareAmount: Number(s.shareAmount !== undefined ? s.shareAmount : s.amount)
    }));

    const title = (payload.title && payload.title.trim().length > 0) 
      ? payload.title.trim() 
      : (payload.description || 'Expense').trim();

    const description = payload.description ? payload.description.trim() : null;

    const response = await api.post('/expenses', {
      roomId: payload.roomId,
      title,
      description,
      amount: Number(payload.amount),
      category: normalizeCategory(payload.category),
      date: payload.date || payload.expenseDate || new Date().toISOString().split('T')[0],
      splitType: payload.splitType || payload.splitMode || 'EQUAL',
      splits: splitsPayload
    });

    return normalizeExpense(response.data);
  },

  async updateExpense(expenseId, expenseData) {
    const splitsPayload = expenseData.splits ? expenseData.splits.map(s => ({
      userId: s.userId,
      shareAmount: Number(s.shareAmount !== undefined ? s.shareAmount : s.amount)
    })) : undefined;

    const response = await api.put(`/expenses/${expenseId}`, {
      title: expenseData.title ? expenseData.title.trim() : undefined,
      description: expenseData.description !== undefined ? (expenseData.description ? expenseData.description.trim() : null) : undefined,
      amount: expenseData.amount !== undefined ? Number(expenseData.amount) : undefined,
      category: expenseData.category ? normalizeCategory(expenseData.category) : undefined,
      date: expenseData.date || expenseData.expenseDate,
      splitType: expenseData.splitType || expenseData.splitMode,
      splits: splitsPayload
    });

    return normalizeExpense(response.data);
  },

  async deleteExpense(expenseId) {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data;
  }
};

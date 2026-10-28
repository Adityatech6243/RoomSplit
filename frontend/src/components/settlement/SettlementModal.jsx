import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ArrowRightLeft } from 'lucide-react';
import { settlementService } from '../../services/settlementService';
import { useAuth } from '../../context/AuthContext';

export const SettlementModal = ({
  isOpen,
  onClose,
  roomId,
  initialSuggestion = null,
  members = [],
  onSuccess
}) => {
  const { currentUser } = useAuth();

  const [paidByUserId, setPaidByUserId] = useState('');
  const [paidToUserId, setPaidToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [settlementDate, setSettlementDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSettledDirectly, setIsSettledDirectly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialSuggestion) {
      setPaidByUserId(String(initialSuggestion.fromUserId));
      setPaidToUserId(String(initialSuggestion.toUserId));
      setAmount(String(initialSuggestion.amount || ''));
      setNote(`Repayment from ${initialSuggestion.fromUserName || 'roommate'} to ${initialSuggestion.toUserName || 'roommate'}`);
    } else {
      if (members.length > 0) {
        const currentUserId = currentUser?.id;
        setPaidByUserId(String(currentUserId || members[0].userId || members[0].id));
        const otherMember = members.find((m) => (m.userId || m.id) !== currentUserId);
        setPaidToUserId(otherMember ? String(otherMember.userId || otherMember.id) : '');
      }
      setAmount('');
      setNote('');
    }
    setError('');
  }, [initialSuggestion, isOpen, members, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paidToUserId) {
      setError('Please select who receives the payment.');
      return;
    }
    if (paidByUserId && paidByUserId === paidToUserId) {
      setError('Payer and receiver cannot be the same roommate.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid positive payment amount.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const created = await settlementService.createSettlement({
        roomId,
        paidTo: paidToUserId,
        paidToUserId: paidToUserId,
        toUserId: paidToUserId,
        amount: Number(amount),
        paymentMethod: paymentMethod || 'UPI',
        notes: note
      });

      // If user chose to immediately settle, mark as settled
      if (isSettledDirectly && created && created.id) {
        await settlementService.markSettled(created.id);
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to record settlement.');
    } finally {
      setLoading(false);
    }
  };

  const memberOptions = members.map((m) => {
    const id = m.userId || m.id;
    const name = m.name || m.userName || 'Roommate';
    return {
      value: String(id),
      label: name + (id === currentUser?.id ? ' (You)' : '')
    };
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settle Up / Record Payment">
      {error && (
        <div style={{ padding: '0.75rem', background: 'var(--negative-bg)', color: 'var(--negative)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' }}>
          <div>
            <label className="form-label">Paying Member</label>
            <select
              className="form-select"
              value={paidByUserId}
              onChange={(e) => setPaidByUserId(e.target.value)}
            >
              {memberOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Receiving Member</label>
            <select
              className="form-select"
              value={paidToUserId}
              onChange={(e) => setPaidToUserId(e.target.value)}
              required
            >
              <option value="">-- Select Receiver --</option>
              {memberOptions
                .filter((opt) => opt.value !== paidByUserId)
                .map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Hero Amount Input */}
        <div className="form-group">
          <label className="form-label">Settlement Amount</label>
          <div className="hero-amount-box">
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹</span>
            <input
              type="number"
              step="any"
              className="hero-amount-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>

        {/* Payment Mode & Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label className="form-label">Payment Mode</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="UPI">UPI (GPay / PhonePe)</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={settlementDate}
              onChange={(e) => setSettlementDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Paid via UPI"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', padding: '0.6rem 0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
          <input
            type="checkbox"
            id="settle-direct"
            checked={isSettledDirectly}
            onChange={(e) => setIsSettledDirectly(e.target.checked)}
            style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="settle-direct" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
            Mark as immediately <strong>SETTLED</strong> (clears debt balance now)
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
          >
            <ArrowRightLeft size={18} />
            <span>{loading ? 'Recording...' : 'Record Payment'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

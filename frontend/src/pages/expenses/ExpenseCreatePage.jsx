import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Save, Calendar, CheckSquare, Square, ChevronDown } from 'lucide-react';
import { useRoom } from '../../context/RoomContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { expenseService } from '../../services/expenseService';
import { roomService } from '../../services/roomService';
import { EXPENSE_CATEGORIES } from '../../constants/categories';
import { getInitials, formatCurrency } from '../../utils/formatters';

export const ExpenseCreatePage = () => {
  const { activeRoom } = useRoom();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('GROCERY');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [splitType, setSplitType] = useState('EQUAL'); // EQUAL or EXACT
  const [customSplits, setCustomSplits] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeRoom?.id) return;
    const loadMembers = async () => {
      try {
        const mems = await roomService.getRoomMembers(activeRoom.id);
        const activeMems = (mems || []).filter((m) => m.isActive !== false);
        setMembers(activeMems);
        setSelectedUserIds(activeMems.map((m) => m.userId));
      } catch (err) {
        console.error('Failed to load room members:', err);
      }
    };
    loadMembers();
  }, [activeRoom?.id]);

  const numAmount = parseFloat(amount) || 0;
  const numSelected = selectedUserIds.length;
  const equalShare = numSelected > 0 ? numAmount / numSelected : 0;

  const handleToggleMember = (userId) => {
    if (selectedUserIds.includes(userId)) {
      if (selectedUserIds.length === 1) return; // Must have at least 1
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const calculateTotalCustomSplits = () => {
    return selectedUserIds.reduce((sum, id) => sum + (parseFloat(customSplits[id]) || 0), 0);
  };

  const isBalanced =
    splitType === 'EQUAL'
      ? numAmount > 0 && numSelected > 0
      : Math.abs(calculateTotalCustomSplits() - numAmount) < 0.01;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter an expense title.');
      return;
    }
    if (selectedUserIds.length === 0) {
      setError('Please select at least one participating roommate.');
      return;
    }
    if (!isBalanced) {
      setError('Split amounts do not match the total expense amount.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let splits = [];
      if (splitType === 'EQUAL') {
        const share = Number((numAmount / selectedUserIds.length).toFixed(2));
        splits = selectedUserIds.map((userId, idx) => {
          // Adjust last split for rounding
          const splitAmt = idx === selectedUserIds.length - 1
            ? Number((numAmount - share * (selectedUserIds.length - 1)).toFixed(2))
            : share;
          return { userId, amount: splitAmt };
        });
      } else {
        splits = selectedUserIds.map((userId) => ({
          userId,
          amount: parseFloat(customSplits[userId]) || 0
        }));
      }

      await expenseService.createExpense(activeRoom.id, {
        title: title.trim(),
        amount: numAmount,
        category,
        description: description.trim(),
        expenseDate,
        splitType: splitType === 'EQUAL' ? 'EQUAL' : 'EXACT',
        splits
      });

      addToast('Expense recorded successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 1. Modal / Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Add Expense</h1>
        </div>

        <div
          style={{
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-full)'
          }}
        >
          {activeRoom?.roomName || 'Pune Flat'}
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', background: 'var(--negative-bg)', color: 'var(--negative)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 2. Amount Box */}
        <div className="form-group">
          <label className="form-label">Amount</label>
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

        {/* 3. Expense Title */}
        <div className="form-group">
          <label className="form-label">Expense Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Monthly Grocery"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 4. Category & Date Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* 5. Description (Optional) */}
        <div className="form-group">
          <label className="form-label">Description (Optional)</label>
          <textarea
            className="form-textarea"
            placeholder="Add any extra notes or item lists..."
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* 6. Who Participated Section */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <div className="card-title-row" style={{ marginBottom: '0.625rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Who participated?</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
              {selectedUserIds.length} selected
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {members.map((member) => {
              const isSelected = selectedUserIds.includes(member.userId);
              return (
                <div
                  key={member.userId}
                  onClick={() => handleToggleMember(member.userId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--primary-light)' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--primary)' : '#cbd5e1',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getInitials(member.name)}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      {member.name} {member.userId === currentUser?.id ? '(You)' : ''}
                    </span>
                  </div>

                  <div style={{ color: isSelected ? 'var(--primary)' : '#94a3b8' }}>
                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. Split Type Selector */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.625rem' }}>
            Split Type
          </div>

          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-option ${splitType === 'EQUAL' ? 'active' : ''}`}
              onClick={() => setSplitType('EQUAL')}
            >
              Equal Split
            </button>
            <button
              type="button"
              className={`segmented-option ${splitType === 'EXACT' ? 'active' : ''}`}
              onClick={() => setSplitType('EXACT')}
            >
              Custom Split
            </button>
          </div>

          {/* Breakdown Box */}
          <div style={{ background: '#f8fafc', padding: '0.75rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <span>Calculation</span>
              <span>
                {splitType === 'EQUAL'
                  ? `${formatCurrency(numAmount)} ÷ ${numSelected} members`
                  : 'Manual custom amounts'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {members
                .filter((m) => selectedUserIds.includes(m.userId))
                .map((m) => (
                  <div key={m.userId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 600 }}>{m.name}</span>
                    {splitType === 'EQUAL' ? (
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {formatCurrency(equalShare)}
                      </span>
                    ) : (
                      <input
                        type="number"
                        placeholder="0.00"
                        style={{ width: '80px', padding: '0.2rem 0.4rem', border: '1px solid var(--border)', borderRadius: '4px', textAlign: 'right', fontWeight: 700 }}
                        value={customSplits[m.userId] || ''}
                        onChange={(e) => setCustomSplits({ ...customSplits, [m.userId]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
            </div>

            {/* Split balanced check */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                marginTop: '0.75rem',
                padding: '0.45rem',
                borderRadius: 'var(--radius-sm)',
                background: isBalanced ? '#dcfce7' : '#fee2e2',
                color: isBalanced ? '#15803d' : '#b91c1c',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              <Check size={14} />
              <span>{isBalanced ? 'Split is balanced' : 'Split is unbalanced'}</span>
            </div>
          </div>
        </div>

        {/* 8. Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
          >
            <Save size={18} />
            <span>{loading ? 'Saving...' : 'Save Expense'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary btn-full"
            style={{ padding: '0.75rem' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

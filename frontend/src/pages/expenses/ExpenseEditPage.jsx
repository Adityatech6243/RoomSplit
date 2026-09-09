import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expenseService } from '../../services/expenseService';
import { useAuth } from '../../context/AuthContext';
import { useRoom } from '../../context/RoomContext';
import { useToast } from '../../context/ToastContext';
import { Skeleton } from '../../components/common/Skeleton';
import { ShieldAlert, X, Save } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../constants/categories';

export const ExpenseEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { activeRoom } = useRoom();
  const { addToast } = useToast();

  const [expense, setExpense] = useState(null);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('GROCERY');
  const [expenseDate, setExpenseDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [splitType, setSplitType] = useState('EQUAL');
  const [customSplits, setCustomSplits] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notOwner, setNotOwner] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    expenseService.getExpense(id)
      .then((expData) => {
        const isOwner = (expData.paidBy?.id === currentUser?.id) || (expData.payerId === currentUser?.id);
        if (!isOwner) {
          setNotOwner(true);
        } else {
          setExpense(expData);
          setAmount(String(expData.amount || ''));
          setTitle(expData.title || expData.description || '');
          setCategory(expData.category || 'GROCERY');
          setExpenseDate(expData.date || expData.expenseDate || new Date().toISOString().split('T')[0]);
          setDescription(expData.description || '');
          setSplitType(expData.splitType || 'EQUAL');

          const userIds = (expData.splits || []).map((s) => s.userId);
          setSelectedUserIds(userIds);

          const cSplits = {};
          (expData.splits || []).forEach((s) => {
            cSplits[s.userId] = s.shareAmount || s.amount;
          });
          setCustomSplits(cSplits);
        }
      })
      .catch((err) => {
        addToast(err.response?.data?.message || 'Failed to load expense.', 'error');
        navigate('/expenses');
      })
      .finally(() => setLoading(false));
  }, [id, currentUser?.id, navigate, addToast]);

  const numAmount = parseFloat(amount) || 0;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter an expense title.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      let splits = [];
      if (splitType === 'EQUAL') {
        const share = Number((numAmount / selectedUserIds.length).toFixed(2));
        splits = selectedUserIds.map((userId, idx) => {
          const splitAmt = idx === selectedUserIds.length - 1
            ? Number((numAmount - share * (selectedUserIds.length - 1)).toFixed(2))
            : share;
          return { userId, shareAmount: splitAmt };
        });
      } else {
        splits = selectedUserIds.map((userId) => ({
          userId,
          shareAmount: parseFloat(customSplits[userId]) || 0
        }));
      }

      await expenseService.updateExpense(expense.id, {
        roomId: activeRoom.id,
        title: title.trim(),
        amount: numAmount,
        category,
        date: expenseDate,
        description: description.trim(),
        splitType,
        splits
      });

      addToast('Expense updated successfully!', 'success');
      navigate(`/expenses/${expense.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update expense.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Skeleton height="30px" width="120px" />
        <Skeleton height="160px" borderRadius="var(--radius-lg)" />
        <Skeleton height="200px" borderRadius="var(--radius-lg)" />
      </div>
    );
  }

  if (notOwner) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
        <ShieldAlert size={36} color="var(--negative)" style={{ margin: '0 auto 0.75rem' }} />
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Permission Denied</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Only the creator of this expense can modify it.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/expenses')}>
          Back to Expenses
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button
          onClick={() => navigate(`/expenses/${expense.id}`)}
          style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Edit Expense</h1>
        <div style={{ width: '32px' }} />
      </div>

      {error && (
        <div style={{ padding: '0.75rem', background: 'var(--negative-bg)', color: 'var(--negative)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label className="form-label">Amount</label>
          <div className="hero-amount-box">
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹</span>
            <input
              type="number"
              step="any"
              className="hero-amount-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Expense Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

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

        <div className="form-group">
          <label className="form-label">Description (Optional)</label>
          <textarea
            className="form-textarea"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '1.25rem' }}>
          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={submitting}>
            <Save size={18} />
            <span>{submitting ? 'Updating...' : 'Save Changes'}</span>
          </button>
          <button type="button" onClick={() => navigate(`/expenses/${expense.id}`)} className="btn btn-secondary btn-full">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

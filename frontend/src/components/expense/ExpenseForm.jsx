import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXPENSE_CATEGORIES } from '../../constants/categories';
import { ParticipantSelector } from './ParticipantSelector';
import { SplitEditor } from './SplitEditor';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { validateCustomSplits } from '../../utils/splitCalculator';
import { Receipt, UserCheck } from 'lucide-react';

export const ExpenseForm = ({
  initialData = null,
  roomMembers = [],
  currentUser,
  onSubmit,
  loading = false,
  isEdit = false
}) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount ? String(initialData.amount) : '');
  const [category, setCategory] = useState(initialData?.category || 'GROCERY');
  const [expenseDate, setExpenseDate] = useState(
    initialData?.expenseDate || new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState(initialData?.description || '');

  // Participants: array of userIds
  const [selectedUserIds, setSelectedUserIds] = useState(
    initialData?.splits?.map(s => s.userId) || roomMembers.map(m => m.userId)
  );

  // Split mode
  const [splitMode, setSplitMode] = useState(initialData?.splitMode || 'EQUAL');
  const [splits, setSplits] = useState(initialData?.splits || []);
  const [error, setError] = useState('');

  // Format category options for Select
  const categoryOptions = EXPENSE_CATEGORIES.map(c => ({
    value: c.id,
    label: c.label
  }));

  const activeParticipants = roomMembers
    .filter(m => selectedUserIds.includes(m.userId))
    .map(m => ({ userId: m.userId, userName: m.name || m.userName }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an expense title.');
      return;
    }
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please provide a valid positive expense amount.');
      return;
    }
    if (selectedUserIds.length === 0) {
      setError('Please select at least one participating roommate.');
      return;
    }

    if (splitMode === 'CUSTOM') {
      const validation = validateCustomSplits(numAmount, splits);
      if (!validation.isValid) {
        setError('The custom shares must exactly equal the total expense amount.');
        return;
      }
    }

    setError('');
    onSubmit({
      title: title.trim(),
      amount: numAmount,
      category,
      expenseDate,
      description: description.trim(),
      splitMode,
      splits: splits.map(s => ({
        userId: s.userId,
        userName: s.userName,
        shareAmount: Number(s.shareAmount)
      }))
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'var(--negative-bg)', color: 'var(--negative)', border: '1px solid var(--negative-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      {/* Basic Info Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <Input
          id="exp-title"
          label="Expense Title"
          placeholder="e.g. Monthly Grocery from D-Mart"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          id="exp-amount"
          label="Total Amount (₹)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="e.g. 1200"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <Select
          id="exp-category"
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <Input
          id="exp-date"
          label="Date of Expense"
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          required
        />
      </div>

      {/* Payer Display (derived from auth context, not arbitrary client choice) */}
      <div style={{ padding: '0.75rem 1rem', background: '#eef2ff', borderRadius: 'var(--radius-md)', border: '1px solid #c7d2fe', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--primary)' }}>
        <UserCheck size={18} />
        <span>
          <strong>Paid by:</strong> {isEdit ? initialData?.paidBy?.name : `${currentUser?.name} (You)`}
          {' '}— Expense creator is automatically registered as the payer.
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="exp-desc" className="form-label">
          Optional Details / Notes
        </label>
        <textarea
          id="exp-desc"
          className="form-textarea"
          rows={2}
          placeholder="e.g. Items bought, bill receipt notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Participant Selector */}
      <ParticipantSelector
        members={roomMembers}
        selectedUserIds={selectedUserIds}
        onChange={setSelectedUserIds}
      />

      {/* Equal / Custom Split Editor */}
      <SplitEditor
        splitMode={splitMode}
        onSplitModeChange={setSplitMode}
        totalAmount={amount}
        participants={activeParticipants}
        splits={splits}
        onSplitsChange={setSplits}
      />

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
        <Button variant="secondary" onClick={() => navigate(-1)} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading} icon={Receipt}>
          {isEdit ? 'Save Changes' : 'Record Expense'}
        </Button>
      </div>
    </form>
  );
};

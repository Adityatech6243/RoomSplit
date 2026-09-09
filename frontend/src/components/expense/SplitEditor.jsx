import React, { useEffect } from 'react';
import { calculateEqualSplits, validateCustomSplits } from '../../utils/splitCalculator';
import { formatCurrency } from '../../utils/formatters';
import { Check, AlertCircle, Scale, Sliders } from 'lucide-react';

export const SplitEditor = ({
  splitMode, // 'EQUAL' | 'CUSTOM'
  onSplitModeChange,
  totalAmount,
  participants = [], // array of { userId, name/userName }
  splits = [],       // array of { userId, userName, shareAmount }
  onSplitsChange
}) => {
  const amount = Number(totalAmount) || 0;

  // Whenever in EQUAL mode and participants or totalAmount change, recalculate equal splits
  useEffect(() => {
    if (splitMode === 'EQUAL') {
      const calculated = calculateEqualSplits(amount, participants);
      onSplitsChange(calculated);
    }
  }, [splitMode, amount, participants]);

  const handleCustomShareChange = (userId, value) => {
    const numeric = value === '' ? '' : Math.max(0, Number(value));
    const nextSplits = splits.map(s => {
      if (s.userId === userId) {
        return { ...s, shareAmount: numeric };
      }
      return s;
    });
    onSplitsChange(nextSplits);
  };

  const validation = validateCustomSplits(amount, splits);

  return (
    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
      
      {/* Split Mode Selector Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          Expense Splitting Mode
        </label>
        <div style={{ display: 'flex', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
          <button
            type="button"
            onClick={() => onSplitModeChange('EQUAL')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: splitMode === 'EQUAL' ? 'var(--primary)' : 'transparent',
              color: splitMode === 'EQUAL' ? 'white' : 'var(--text-muted)'
            }}
          >
            <Scale size={14} /> Equal Split
          </button>
          <button
            type="button"
            onClick={() => onSplitModeChange('CUSTOM')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: splitMode === 'CUSTOM' ? 'var(--primary)' : 'transparent',
              color: splitMode === 'CUSTOM' ? 'white' : 'var(--text-muted)'
            }}
          >
            <Sliders size={14} /> Custom Split
          </button>
        </div>
      </div>

      {participants.length === 0 ? (
        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Please select at least one participating roommate above.
        </div>
      ) : (
        <>
          {/* List of Shares */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {splits.map(s => (
              <div
                key={s.userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.875rem',
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}
              >
                <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{s.userName}</span>
                {splitMode === 'EQUAL' ? (
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {formatCurrency(s.shareAmount)}
                  </span>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', maxWidth: '140px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', textAlign: 'right', fontWeight: 600 }}
                      value={s.shareAmount === '' ? '' : s.shareAmount}
                      onChange={(e) => handleCustomShareChange(s.userId, e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Validation & Balance Tracker */}
          {splitMode === 'CUSTOM' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: validation.isValid ? 'var(--positive-bg)' : 'var(--negative-bg)',
                border: `1px solid ${validation.isValid ? 'var(--positive-border)' : 'var(--negative-border)'}`,
                fontSize: '0.875rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: validation.isValid ? 'var(--positive)' : 'var(--negative)' }}>
                {validation.isValid ? <Check size={18} /> : <AlertCircle size={18} />}
                <span>
                  {validation.isValid
                    ? 'Split balanced'
                    : validation.isUnder
                    ? `Remaining to assign: ${formatCurrency(validation.difference)}`
                    : `Overage: ${formatCurrency(Math.abs(validation.difference))}`}
                </span>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                Total: {formatCurrency(validation.currentTotal)} / {formatCurrency(amount)}
              </div>
            </div>
          )}

          {splitMode === 'EQUAL' && amount > 0 && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              Evenly split among {participants.length} flatmates • {formatCurrency(amount / participants.length)} each
            </div>
          )}
        </>
      )}
    </div>
  );
};

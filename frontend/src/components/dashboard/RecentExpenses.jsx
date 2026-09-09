import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CategoryBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { Receipt, ChevronRight } from 'lucide-react';

export const RecentExpenses = ({ expenses = [], currentUserId }) => {
  const navigate = useNavigate();

  if (!expenses || expenses.length === 0) {
    return (
      <div className="card">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Recent Expenses</h3>
        <EmptyState
          icon={Receipt}
          title="No expenses recorded yet"
          description="Be the first to record a grocery or household expense for this room."
          actionLabel="Add Expense"
          onAction={() => navigate('/expenses/new')}
        />
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem' }}>Recent Room Activity</h3>
        <button
          onClick={() => navigate('/expenses')}
          style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
        >
          View All ({expenses.length}) <ChevronRight size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {expenses.slice(0, 5).map(exp => {
          const isOwner = exp.paidBy.id === currentUserId;
          return (
            <div
              key={exp.id}
              onClick={() => navigate(`/expenses/${exp.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'white'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CategoryBadge category={exp.category} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                    {exp.title}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Paid by <strong style={{ color: isOwner ? 'var(--primary)' : 'inherit' }}>{isOwner ? 'You' : exp.paidBy.name}</strong> • {formatDate(exp.expenseDate)}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                  {formatCurrency(exp.amount)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {exp.splits?.length || 0} participants
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

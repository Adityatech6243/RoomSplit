import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expenseService } from '../../services/expenseService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate, getInitials } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Skeleton } from '../../components/common/Skeleton';
import { ArrowLeft, Edit3, Trash2, Calendar, User, FileText, ShoppingCart, Sparkles, Wifi, Utensils, Zap } from 'lucide-react';

export const ExpenseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    expenseService.getExpense(id)
      .then((data) => setExpense(data))
      .catch((err) => {
        addToast(err.response?.data?.message || 'Expense not found.', 'error');
        navigate('/expenses');
      })
      .finally(() => setLoading(false));
  }, [id, navigate, addToast]);

  const isOwner = expense && currentUser && (
    (expense.paidBy && expense.paidBy.id === currentUser.id) ||
    expense.payerId === currentUser.id
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await expenseService.deleteExpense(expense.id);
      addToast('Expense deleted successfully.', 'success');
      navigate('/expenses');
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to delete expense.', 'error');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
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

  if (!expense) return null;

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate('/expenses')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '1rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Expenses
      </button>

      {/* Main Expense Card */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <span className={`badge badge-${(expense.category || 'other').toLowerCase()}`} style={{ marginBottom: '0.4rem' }}>
              {expense.category || 'Other'}
            </span>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {expense.title}
            </h1>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
              <Calendar size={13} /> {formatDate(expense.expenseDate || expense.date)}
            </div>
          </div>

          {isOwner && (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => navigate(`/expenses/${expense.id}/edit`)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem 0.6rem' }}
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="btn btn-danger btn-sm"
                style={{ padding: '0.35rem 0.6rem' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Amount & Payer block */}
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Amount
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {formatCurrency(expense.amount)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Paid By
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', justifyContent: 'flex-end' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getInitials(expense.payerName || expense.paidBy?.name || 'U')}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                {isOwner ? 'You' : (expense.payerName || expense.paidBy?.name || 'Roommate')}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {expense.description && (
          <div style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <strong>Notes:</strong> {expense.description}
          </div>
        )}
      </div>

      {/* Participant Splits Breakdown */}
      <div className="card">
        <div style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Participant Shares ({expense.splits?.length || 0})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {expense.splits?.map((split) => {
            const isPayer = split.userId === expense.paidBy?.id || split.userId === expense.payerId;
            return (
              <div
                key={split.userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#f8fafc',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e2e8f0', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getInitials(split.userName || split.name || 'U')}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      {split.userId === currentUser?.id ? 'You' : (split.userName || split.name)}
                    </div>
                    {isPayer && (
                      <span style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 700 }}>
                        Payer
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {formatCurrency(split.shareAmount || split.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message={`Delete "${expense.title}"? This will update room balances and remove all associated shares.`}
        confirmText="Delete Expense"
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
};

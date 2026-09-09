import React from 'react';
import { ArrowRight, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';

export const BalanceSummaryWidget = ({ suggestions = [], onOpenSettleModal, currentUserId }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem' }}>Settlement Suggestions</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Optimal transfers to balance room accounts
          </p>
        </div>
        <Button size="sm" variant="secondary" icon={ArrowRightLeft} onClick={onOpenSettleModal}>
          Record Payment
        </Button>
      </div>

      {suggestions.length === 0 ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
          <CheckCircle2 size={28} color="var(--positive)" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>All balances are clear!</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No one owes money right now in this room.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {suggestions.map((sug, idx) => {
            const isYouPayer = sug.fromUserId === currentUserId;
            const isYouReceiver = sug.toUserId === currentUserId;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: isYouPayer ? 'var(--negative-bg)' : isYouReceiver ? 'var(--positive-bg)' : '#f8fafc',
                  border: `1px solid ${isYouPayer ? 'var(--negative-border)' : isYouReceiver ? 'var(--positive-border)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: isYouPayer ? 'var(--negative)' : 'inherit' }}>
                    {isYouPayer ? 'You' : sug.fromUserName}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                    <ArrowRight size={16} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: isYouReceiver ? 'var(--positive)' : 'inherit' }}>
                    {isYouReceiver ? 'You' : sug.toUserName}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                    {formatCurrency(sug.amount)}
                  </span>
                  <Button
                    size="sm"
                    variant={isYouPayer ? 'danger' : 'primary'}
                    onClick={() => onOpenSettleModal(sug)}
                  >
                    Settle
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

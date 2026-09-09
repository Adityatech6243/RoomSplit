import React, { useState, useEffect, useCallback } from 'react';
import { useRoom } from '../../context/RoomContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { balanceService } from '../../services/balanceService';
import { formatCurrency, getInitials } from '../../utils/formatters';
import { SettlementModal } from '../../components/settlement/SettlementModal';
import { Skeleton } from '../../components/common/Skeleton';
import { Scale, ArrowRight, ArrowRightLeft, CheckCircle2, TrendingUp, TrendingDown, Plus } from 'lucide-react';

export const BalancesPage = () => {
  const { activeRoom } = useRoom();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState({ balances: [], suggestions: [], simplifiedDebts: [] });
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const loadBalances = useCallback(async () => {
    if (!activeRoom?.id) {
      setBalanceData({ balances: [], suggestions: [], simplifiedDebts: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await balanceService.getRoomBalances(activeRoom.id);
      setBalanceData(res || { balances: [], suggestions: [], simplifiedDebts: [] });
    } catch (err) {
      console.error('Failed to load balances:', err);
    } finally {
      setLoading(false);
    }
  }, [activeRoom?.id]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  const handleOpenSettle = (suggestion = null) => {
    setSelectedSuggestion(suggestion);
    setSettleModalOpen(true);
  };

  const suggestions = balanceData.suggestions || balanceData.simplifiedDebts || [];
  const balances = balanceData.balances || [];

  return (
    <div>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>Balances</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
            Who owes whom & member balances in {activeRoom?.roomName}.
          </p>
        </div>

        {activeRoom && (
          <button
            onClick={() => handleOpenSettle()}
            className="btn btn-primary"
            style={{ padding: '0.6rem 0.9rem', fontSize: '0.8125rem', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Settle Up</span>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Skeleton height="90px" borderRadius="var(--radius-lg)" />
          <Skeleton height="70px" borderRadius="var(--radius-lg)" />
          <Skeleton height="70px" borderRadius="var(--radius-lg)" />
        </div>
      ) : (
        <>
          {/* Section 1: Settlement Suggestions (Debt Minimization) */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="card-title-row" style={{ marginBottom: '0.625rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Settlement Suggestions</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 700, background: 'var(--primary-light)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)' }}>
                Min Payments
              </span>
            </div>

            {suggestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.25rem 0.5rem' }}>
                <CheckCircle2 size={28} color="var(--positive)" style={{ margin: '0 auto 0.35rem' }} />
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>All accounts are balanced!</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  No outstanding debts exist in this room.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {suggestions.map((sug, idx) => {
                  const isYouPayer = sug.fromUserId === currentUser?.id;
                  const isYouReceiver = sug.toUserId === currentUser?.id;
                  const payerName = sug.fromUserName || 'Roommate';
                  const receiverName = sug.toUserName || 'Roommate';

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.875rem',
                        borderRadius: 'var(--radius-md)',
                        background: isYouPayer ? '#fff1f2' : isYouReceiver ? '#ecfdf5' : '#f8fafc',
                        border: `1px solid ${isYouPayer ? '#fecdd3' : isYouReceiver ? '#a7f3d0' : 'var(--border-light)'}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isYouPayer ? '#e11d48' : isYouReceiver ? 'var(--primary)' : '#64748b',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {getInitials(payerName)}
                        </div>

                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>{payerName}</span>
                            <ArrowRight size={13} color="var(--text-muted)" />
                            <span>{receiverName}</span>
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: isYouPayer ? 'var(--negative)' : isYouReceiver ? 'var(--primary)' : 'var(--text-muted)' }}>
                            {isYouPayer ? 'You owe this amount' : isYouReceiver ? 'You will receive this' : 'Recommended transfer'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {formatCurrency(sug.amount)}
                        </span>
                        <button
                          onClick={() => handleOpenSettle(sug)}
                          className={isYouPayer ? 'btn btn-danger btn-sm' : 'btn btn-primary btn-sm'}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          Settle
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Clean Member Balance Cards */}
          <div className="card">
            <div className="card-title-row" style={{ marginBottom: '0.875rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Member Positions</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {balances.length} roommates
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {balances.map((b) => {
                const isYou = b.userId === currentUser?.id;
                const net = Number(b.finalBalance !== undefined ? b.finalBalance : (b.netBalance || 0));
                const isPositive = net > 0.01;
                const isNegative = net < -0.01;
                const memberName = b.name || b.userName || 'Roommate';

                return (
                  <div
                    key={b.userId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.875rem',
                      borderRadius: 'var(--radius-md)',
                      background: isYou ? 'var(--primary-light)' : '#f8fafc',
                      border: isYou ? '1.5px solid var(--primary-border)' : '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: isYou ? 'var(--primary)' : '#cbd5e1',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {getInitials(memberName)}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                          {memberName} {isYou && <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>(You)</span>}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                          Paid: {formatCurrency(b.totalPaid)} • Share: {formatCurrency(b.totalOwed !== undefined ? b.totalOwed : b.totalShare)}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 800,
                          color: isPositive ? 'var(--positive)' : isNegative ? 'var(--negative)' : 'var(--text-muted)'
                        }}
                      >
                        {isPositive ? `+${formatCurrency(net)}` : isNegative ? `-${formatCurrency(Math.abs(net))}` : '₹0'}
                      </div>
                      <div
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: isPositive ? 'var(--positive)' : isNegative ? 'var(--negative)' : 'var(--text-muted)'
                        }}
                      >
                        {isPositive ? 'Gets back' : isNegative ? 'Owes' : 'Settled'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Record Settlement Modal */}
      <SettlementModal
        isOpen={settleModalOpen}
        onClose={() => setSettleModalOpen(false)}
        roomId={activeRoom?.id}
        initialSuggestion={selectedSuggestion}
        members={balances}
        onSuccess={() => {
          loadBalances();
          addToast('Settlement recorded successfully!', 'success');
        }}
      />
    </div>
  );
};

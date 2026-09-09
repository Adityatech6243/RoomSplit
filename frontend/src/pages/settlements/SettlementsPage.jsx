import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRoom } from '../../context/RoomContext';
import { useToast } from '../../context/ToastContext';
import { settlementService } from '../../services/settlementService';
import { roomService } from '../../services/roomService';
import { formatCurrency, formatDate, getInitials } from '../../utils/formatters';
import { SettlementModal } from '../../components/settlement/SettlementModal';
import { Skeleton } from '../../components/common/Skeleton';
import { ArrowRight, Check, Plus, CheckCircle2 } from 'lucide-react';

export const SettlementsPage = () => {
  const { activeRoom } = useRoom();
  const { addToast } = useToast();

  const [settlements, setSettlements] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'SETTLED'
  const [modalOpen, setModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const loadData = useCallback(async () => {
    if (!activeRoom?.id) return;
    setLoading(true);
    try {
      const [settleRes, memberRes] = await Promise.all([
        settlementService.getRoomSettlements(activeRoom.id),
        roomService.getRoomMembers(activeRoom.id)
      ]);
      setSettlements(settleRes || []);
      setMembers(memberRes || []);
    } catch (err) {
      console.error('Failed to load settlements:', err);
    } finally {
      setLoading(false);
    }
  }, [activeRoom?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMarkSettled = async (settlementId) => {
    setProcessingId(settlementId);
    try {
      await settlementService.markSettled(settlementId);
      addToast('Settlement marked as settled!', 'success');
      loadData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update settlement.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredSettlements = useMemo(() => {
    if (statusTab === 'ALL') return settlements;
    return settlements.filter(s => s.status === statusTab);
  }, [settlements, statusTab]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>Settlements</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
            Payment history & pending repayments in {activeRoom?.roomName}.
          </p>
        </div>

        {activeRoom && (
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '0.6rem 0.9rem', fontSize: '0.8125rem', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Record Payment</span>
          </button>
        )}
      </div>

      {/* Status Segmented Tabs */}
      <div className="segmented-control" style={{ marginBottom: '1rem' }}>
        <button
          className={`segmented-option ${statusTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setStatusTab('ALL')}
        >
          All ({settlements.length})
        </button>
        <button
          className={`segmented-option ${statusTab === 'PENDING' ? 'active' : ''}`}
          onClick={() => setStatusTab('PENDING')}
        >
          Pending ({settlements.filter(s => s.status === 'PENDING').length})
        </button>
        <button
          className={`segmented-option ${statusTab === 'SETTLED' ? 'active' : ''}`}
          onClick={() => setStatusTab('SETTLED')}
        >
          Settled ({settlements.filter(s => s.status === 'SETTLED').length})
        </button>
      </div>

      {/* Settlement Cards List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Skeleton height="75px" borderRadius="var(--radius-lg)" />
          <Skeleton height="75px" borderRadius="var(--radius-lg)" />
        </div>
      ) : filteredSettlements.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <CheckCircle2 size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {statusTab === 'ALL' ? 'No settlements recorded yet' : `No ${statusTab.toLowerCase()} settlements`}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
            When roommates repay debts, record payments here to balance accounts.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-secondary btn-sm"
          >
            Record First Settlement
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {filteredSettlements.map((s) => {
            const payerName = s.paidBy?.name || s.fromUserName || 'Roommate';
            const payeeName = s.paidTo?.name || s.toUserName || 'Roommate';
            const isPending = s.status === 'PENDING';

            return (
              <div
                key={s.id}
                className="card"
                style={{
                  padding: '1rem',
                  marginBottom: 0,
                  borderLeft: isPending ? '4px solid var(--warning)' : '4px solid var(--positive)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#67e8f9',
                        color: '#0f172a',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getInitials(payerName)}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                      {payerName}
                    </span>
                    <ArrowRight size={14} color="var(--text-muted)" />
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                      {payeeName}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: isPending ? '#fef3c7' : '#dcfce7',
                      color: isPending ? '#b45309' : '#15803d'
                    }}
                  >
                    {s.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Paid on {formatDate(s.settledAt || s.createdAt || s.date)}
                    {s.notes && <span> • "{s.notes}"</span>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {formatCurrency(s.amount)}
                    </span>

                    {isPending && (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={processingId === s.id}
                        onClick={() => handleMarkSettled(s.id)}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Check size={13} />
                        <span>{processingId === s.id ? 'Settling...' : 'Mark Settled'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Settlement Modal */}
      <SettlementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        roomId={activeRoom?.id}
        members={members}
        onSuccess={() => {
          loadData();
          addToast('Settlement recorded successfully!', 'success');
        }}
      />
    </div>
  );
};

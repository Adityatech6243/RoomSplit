import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowRightLeft,
  Copy,
  Check,
  CreditCard,
  PieChart,
  ArrowDownLeft,
  CheckCircle2,
  ChevronRight,
  ShoppingCart,
  Sparkles,
  Wifi,
  KeyRound,
  Utensils,
  Zap
} from 'lucide-react';
import { useRoom } from '../../context/RoomContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { balanceService } from '../../services/balanceService';
import { expenseService } from '../../services/expenseService';
import { roomService } from '../../services/roomService';
import { SettlementModal } from '../../components/settlement/SettlementModal';
import { Skeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { formatCurrency, getInitials, formatDate } from '../../utils/formatters';

export const DashboardPage = () => {
  const { activeRoom, switchRoom, refreshRooms, loadingRooms } = useRoom();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [balanceData, setBalanceData] = useState({ balances: [], suggestions: [], simplifiedDebts: [] });
  const [members, setMembers] = useState([]);
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [copied, setCopied] = useState(false);

  // Modals for creating/joining when 0 rooms
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomActionLoading, setRoomActionLoading] = useState(false);
  const [roomActionError, setRoomActionError] = useState('');

  const loadDashboardData = useCallback(async () => {
    if (!activeRoom?.id) {
      setExpenses([]);
      setBalanceData({ balances: [], suggestions: [], simplifiedDebts: [] });
      setMembers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [expRes, balRes, memRes] = await Promise.all([
        expenseService.getRoomExpenses(activeRoom.id),
        balanceService.getRoomBalances(activeRoom.id),
        roomService.getRoomMembers(activeRoom.id)
      ]);
      setExpenses(expRes || []);
      setBalanceData(balRes || { balances: [], suggestions: [], simplifiedDebts: [] });
      setMembers(memRes || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeRoom?.id]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setRoomActionLoading(true);
    setRoomActionError('');
    try {
      const created = await roomService.createRoom({ roomName: roomName.trim() });
      await refreshRooms();
      switchRoom(created.id);
      addToast(`Room "${created.roomName}" created successfully!`, 'success');
      setCreateModalOpen(false);
      setRoomName('');
    } catch (err) {
      setRoomActionError(err.response?.data?.message || err.message || 'Failed to create room.');
    } finally {
      setRoomActionLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    setRoomActionLoading(true);
    setRoomActionError('');
    try {
      const joined = await roomService.joinRoom({ roomCode: roomCode.trim().toUpperCase() });
      await refreshRooms();
      switchRoom(joined.id);
      addToast(`Joined "${joined.roomName}" successfully!`, 'success');
      setJoinModalOpen(false);
      setRoomCode('');
    } catch (err) {
      setRoomActionError(err.response?.data?.message || err.message || 'Failed to join room.');
    } finally {
      setRoomActionLoading(false);
    }
  };

  const handleCopyCode = (e) => {
    e?.stopPropagation();
    if (activeRoom?.roomCode) {
      navigator.clipboard.writeText(activeRoom.roomCode);
      setCopied(true);
      addToast(`Room code copied!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenSettle = (suggestion = null) => {
    setSelectedSuggestion(suggestion);
    setSettleModalOpen(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('groc')) return <ShoppingCart size={18} color="#059669" />;
    if (cat.includes('clean')) return <Sparkles size={18} color="#0284c7" />;
    if (cat.includes('inter') || cat.includes('wifi')) return <Wifi size={18} color="#0d9488" />;
    if (cat.includes('food') || cat.includes('milk')) return <Utensils size={18} color="#e11d48" />;
    if (cat.includes('util') || cat.includes('elec')) return <Zap size={18} color="#d97706" />;
    return <ShoppingCart size={18} color="var(--primary)" />;
  };

  const getCategoryBg = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('groc')) return '#dcfce7';
    if (cat.includes('clean')) return '#e0f2fe';
    if (cat.includes('inter') || cat.includes('wifi')) return '#ccfbf1';
    if (cat.includes('food') || cat.includes('milk')) return '#fee2e2';
    if (cat.includes('util') || cat.includes('elec')) return '#fef3c7';
    return '#f1f5f9';
  };

  const myBalance = (balanceData.balances || []).find((b) => b.userId === currentUser?.id) || {
    totalPaid: 0,
    totalOwed: 0,
    netBalance: 0
  };

  const netBalance = Number(myBalance.netBalance || 0);
  const totalRoomExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const suggestions = balanceData.simplifiedDebts || balanceData.suggestions || [];

  // Group expenses by category for spending bar
  const categoryTotals = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(exp.amount || 0);
    return acc;
  }, {});

  const categoryColors = {
    GROCERY: '#00594C',
    FOOD: '#088373',
    CLEANING: '#047857',
    UTILITIES: '#5eead4',
    HOUSEHOLD: '#a7f3d0',
    OTHER: '#94a3b8'
  };

  // isLoading = true while rooms or dashboard data are loading
  const isLoading = loading || loadingRooms;

  // If user has 0 rooms AND not loading, show welcome onboarding cards
  if (!activeRoom && !isLoading) {
    return (
      <div style={{ padding: '1rem 0' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Sparkles size={28} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Welcome, {currentUser?.name?.split(' ')[0]}!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Create a flat to invite your roommates, or join an existing flat with an invite code.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => { setRoomActionError(''); setCreateModalOpen(true); }}
              className="btn btn-primary btn-lg btn-full"
            >
              <Plus size={18} />
              <span>Create New Flat</span>
            </button>

            <button
              onClick={() => { setRoomActionError(''); setJoinModalOpen(true); }}
              className="btn btn-secondary btn-lg btn-full"
            >
              <KeyRound size={18} />
              <span>Join with Code</span>
            </button>
          </div>
        </div>

        {/* Create Modal */}
        <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Flat / Room">
          {roomActionError && (
            <div style={{ padding: '0.6rem', background: 'var(--negative-bg)', color: 'var(--negative)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
              {roomActionError}
            </div>
          )}
          <form onSubmit={handleCreateRoom}>
            <Input
              id="room-create-name"
              label="Flat / Room Name"
              placeholder="e.g. Pune Flat"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={roomActionLoading}>
                {roomActionLoading ? 'Creating...' : 'Create Flat'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Join Modal */}
        <Modal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} title="Join Existing Flat">
          {roomActionError && (
            <div style={{ padding: '0.6rem', background: 'var(--negative-bg)', color: 'var(--negative)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
              {roomActionError}
            </div>
          )}
          <form onSubmit={handleJoinRoom}>
            <Input
              id="room-join-code"
              label="6-Digit Invite Code"
              placeholder="e.g. RM7K42P"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              required
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setJoinModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={roomActionLoading}>
                {roomActionLoading ? 'Joining...' : 'Join Flat'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div>
      {/* 1. Header Greeting — always rendered immediately (no loading gate) */}
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
          {getGreeting()}, {currentUser?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
          {isLoading ? 'Loading your flat…' : `Here's what's happening in ${activeRoom?.roomName}.`}
        </p>
      </div>

      {/* While loading, show skeleton cards instead of no content */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Skeleton height="90px" borderRadius="var(--radius-lg)" />
            <Skeleton height="90px" borderRadius="var(--radius-lg)" />
            <Skeleton height="90px" borderRadius="var(--radius-lg)" />
            <Skeleton height="90px" borderRadius="var(--radius-lg)" />
          </div>
          <Skeleton height="70px" borderRadius="var(--radius-lg)" />
          <Skeleton height="140px" borderRadius="var(--radius-lg)" />
        </div>
      )}

      {/* Rest of content — only rendered when data is ready */}
      {!isLoading && (
      <div>

      {/* 2. Top Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.625rem', marginBottom: '1.125rem' }}>
        <button
          onClick={() => navigate('/expenses/new')}
          className="btn btn-primary"
          style={{ padding: '0.75rem', fontSize: '0.875rem', borderRadius: 'var(--radius-md)' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Expense</span>
        </button>

        <button
          onClick={() => handleOpenSettle()}
          className="btn btn-secondary"
          style={{ padding: '0.75rem', fontSize: '0.875rem', borderRadius: 'var(--radius-md)' }}
        >
          <ArrowRightLeft size={16} />
          <span>Settle Up</span>
        </button>
      </div>

      {/* 3. 2x2 Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        {/* You Paid */}
        <div className="card" style={{ padding: '0.9rem', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>You paid</span>
            <CreditCard size={15} color="var(--text-muted)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {formatCurrency(myBalance.totalPaid)}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Total this month
          </div>
        </div>

        {/* Your Share */}
        <div className="card" style={{ padding: '0.9rem', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>Your share</span>
            <PieChart size={15} color="var(--text-muted)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {formatCurrency(myBalance.totalOwed)}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Fair allocation
          </div>
        </div>

        {/* You Should Receive */}
        <div
          className="card"
          style={{
            padding: '0.9rem',
            marginBottom: 0,
            background: netBalance > 0.01 ? '#e6f4f1' : 'var(--card-bg)',
            border: netBalance > 0.01 ? '1px solid #a7f3d0' : '1px solid var(--border-light)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: netBalance > 0.01 ? 'var(--primary)' : 'var(--text-main)' }}>
              You should receive
            </span>
            <ArrowDownLeft size={15} color={netBalance > 0.01 ? 'var(--primary)' : 'var(--text-muted)'} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: netBalance > 0.01 ? 'var(--primary)' : 'var(--text-main)' }}>
            {formatCurrency(netBalance > 0.01 ? netBalance : 0)}
          </div>
          <div style={{ fontSize: '0.6875rem', color: netBalance > 0.01 ? 'var(--primary)' : 'var(--text-muted)', marginTop: '0.15rem' }}>
            Overall pending
          </div>
        </div>

        {/* You Owe */}
        <div
          className="card"
          style={{
            padding: '0.9rem',
            marginBottom: 0,
            background: netBalance < -0.01 ? '#fff1f2' : 'var(--card-bg)',
            border: netBalance < -0.01 ? '1px solid #fecdd3' : '1px solid var(--border-light)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: netBalance < -0.01 ? 'var(--negative)' : 'var(--text-main)' }}>
              You owe
            </span>
            <CheckCircle2 size={15} color={netBalance < -0.01 ? 'var(--negative)' : 'var(--positive)'} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: netBalance < -0.01 ? 'var(--negative)' : 'var(--text-main)' }}>
            {formatCurrency(netBalance < -0.01 ? Math.abs(netBalance) : 0)}
          </div>
          <div style={{ fontSize: '0.6875rem', color: netBalance < -0.01 ? 'var(--negative)' : 'var(--positive)', marginTop: '0.15rem', fontWeight: 600 }}>
            {netBalance < -0.01 ? 'Needs to settle' : 'All caught up!'}
          </div>
        </div>
      </div>

      {/* 4. Flat Info Card */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: '#d1fae5',
              color: 'var(--primary)',
              fontWeight: 800,
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {getInitials(activeRoom?.roomName || 'PF')}
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{activeRoom?.roomName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>{members.length || 1} members</span>
              <span>•</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{activeRoom?.roomCode}</span>
              <span onClick={handleCopyCode} title="Copy code" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {copied ? <Check size={12} color="var(--positive)" /> : <Copy size={12} />}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/members')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--primary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Members
        </button>
      </div>

      {/* 5. Settlement Summary Card */}
      <div className="card">
        <div className="card-title-row">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Settlement Summary</h3>
          <button
            onClick={() => navigate('/balances')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            View Balances <ChevronRight size={14} />
          </button>
        </div>

        {suggestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            <CheckCircle2 size={24} color="var(--positive)" style={{ margin: '0 auto 0.25rem' }} />
            <div>All accounts in {activeRoom?.roomName} are balanced!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {suggestions.slice(0, 3).map((sug, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.6rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#f8fafc'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: idx % 2 === 0 ? '#67e8f9' : '#86efac',
                      color: '#0f172a',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getInitials(sug.fromUserName || 'U')}
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    {sug.fromUserName} → {sug.toUserName}
                  </span>
                </div>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {formatCurrency(sug.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Monthly Spending Breakdown Card */}
      <div className="card">
        <div className="card-title-row">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Monthly Spending</h3>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Total: {formatCurrency(totalRoomExpenses)}
          </span>
        </div>

        {/* Multi-color segmented progress bar */}
        <div style={{ height: '10px', borderRadius: '5px', background: '#f1f5f9', overflow: 'hidden', display: 'flex', margin: '0.75rem 0 1rem' }}>
          {Object.entries(categoryTotals).map(([cat, amt], idx) => {
            const pct = totalRoomExpenses > 0 ? (amt / totalRoomExpenses) * 100 : 0;
            const color = categoryColors[cat.toUpperCase()] || categoryColors.OTHER;
            return (
              <div
                key={idx}
                style={{
                  width: `${pct}%`,
                  background: color,
                  height: '100%'
                }}
              />
            );
          })}
        </div>

        {/* Category Legend Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {Object.entries(categoryTotals).map(([cat, amt], idx) => {
            const color = categoryColors[cat.toUpperCase()] || categoryColors.OTHER;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                <span>
                  {cat} ({formatCurrency(amt)})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Recent Expenses List */}
      <div className="card">
        <div className="card-title-row">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Recent Expenses</h3>
          <button
            onClick={() => navigate('/expenses')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            See all
          </button>
        </div>

        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            No expenses recorded yet. Tap "+ Add Expense" to start!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {expenses.slice(0, 5).map((exp) => (
              <div
                key={exp.id}
                onClick={() => navigate(`/expenses/${exp.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '0.35rem 0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: getCategoryBg(exp.category),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getCategoryIcon(exp.category)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {exp.title}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      Paid by {exp.payerName || exp.payer?.name || 'Roommate'} • {formatDate(exp.expenseDate || exp.createdAt)}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {formatCurrency(exp.amount)}
                  </div>
                  <span className={`badge badge-${(exp.category || 'other').toLowerCase()}`}>
                    {exp.category || 'Other'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Settlement Modal */}
      <SettlementModal
        isOpen={settleModalOpen}
        onClose={() => setSettleModalOpen(false)}
        roomId={activeRoom?.id}
        initialSuggestion={selectedSuggestion}
        members={members.length > 0 ? members : balanceData.balances}
        onSuccess={() => {
          loadDashboardData();
          addToast('Settlement recorded successfully!', 'success');
        }}
      />
      </div>
      )} {/* end !isLoading */}
    </div>
  );
};

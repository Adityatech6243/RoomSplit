import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  ShoppingCart,
  Sparkles,
  Wifi,
  Utensils,
  Briefcase,
  Zap,
  TrendingDown,
  RotateCcw
} from 'lucide-react';
import { useRoom } from '../../context/RoomContext';
import { expenseService } from '../../services/expenseService';
import { formatCurrency } from '../../utils/formatters';
import { Skeleton } from '../../components/common/Skeleton';

export const ExpensesPage = () => {
  const { activeRoom } = useRoom();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const loadExpenses = useCallback(async () => {
    if (!activeRoom?.id) return;
    setLoading(true);
    try {
      const data = await expenseService.getRoomExpenses(activeRoom.id);
      setExpenses(data || []);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [activeRoom?.id]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('groc')) return <ShoppingCart size={18} color="#059669" />;
    if (cat.includes('clean')) return <Sparkles size={18} color="#0284c7" />;
    if (cat.includes('inter') || cat.includes('wifi')) return <Wifi size={18} color="#0d9488" />;
    if (cat.includes('food') || cat.includes('milk')) return <Utensils size={18} color="#e11d48" />;
    if (cat.includes('house')) return <Briefcase size={18} color="#7c3aed" />;
    return <Zap size={18} color="var(--primary)" />;
  };

  const getCategoryBg = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('groc')) return '#dcfce7';
    if (cat.includes('clean')) return '#e0f2fe';
    if (cat.includes('inter') || cat.includes('wifi')) return '#ccfbf1';
    if (cat.includes('food') || cat.includes('milk')) return '#fee2e2';
    if (cat.includes('house')) return '#f3e8ff';
    return '#f1f5f9';
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      !searchQuery ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.payerName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return (
    <div>
      {/* 1. Header with Add Expense Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>Expenses</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
            Track everything spent in your shared home.
          </p>
        </div>

        <button
          onClick={() => navigate('/expenses/new')}
          className="btn btn-primary"
          style={{ padding: '0.6rem 0.9rem', fontSize: '0.8125rem', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* 2. Search Input */}
      <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
        <Search
          size={16}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Search expenses by title, payer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '2.5rem', background: '#ffffff', borderRadius: 'var(--radius-md)' }}
        />
      </div>

      {/* 3. Filter Chips Horizontal Scroll */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          onClick={() => setSelectedCategory('ALL')}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: selectedCategory === 'ALL' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
            background: selectedCategory === 'ALL' ? 'var(--primary-light)' : '#ffffff',
            color: selectedCategory === 'ALL' ? 'var(--primary)' : 'var(--text-main)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Calendar size={13} />
          <span>Date: All Time</span>
        </button>

        {['GROCERY', 'FOOD', 'CLEANING', 'UTILITIES', 'HOUSEHOLD'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? 'ALL' : cat)}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: selectedCategory === cat ? '1.5px solid var(--primary)' : '1px solid var(--border)',
              background: selectedCategory === cat ? 'var(--primary-light)' : '#ffffff',
              color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textTransform: 'capitalize'
            }}
          >
            {cat.toLowerCase()}
          </button>
        ))}
      </div>

      {/* 4. Total Spent Summary Card */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.125rem',
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RotateCcw size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total spent this month</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {formatCurrency(totalSpent)}
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#dcfce7',
            color: '#15803d',
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <TrendingDown size={13} />
          <span>Active</span>
        </div>
      </div>

      {/* 5. Expense Cards List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Skeleton height="70px" borderRadius="var(--radius-lg)" />
          <Skeleton height="70px" borderRadius="var(--radius-lg)" />
          <Skeleton height="70px" borderRadius="var(--radius-lg)" />
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No expenses found matching your criteria.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {filteredExpenses.map((exp) => {
            const splitCount = exp.splits?.length || 1;
            const perPersonShare = Number(exp.amount || 0) / splitCount;

            return (
              <div
                key={exp.id}
                className="card"
                onClick={() => navigate(`/expenses/${exp.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1rem',
                  marginBottom: 0,
                  cursor: 'pointer',
                  transition: 'transform 0.1s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: getCategoryBg(exp.category),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {getCategoryIcon(exp.category)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {exp.title}
                      </span>
                      <span className={`badge badge-${(exp.category || 'other').toLowerCase()}`}>
                        {exp.category || 'Other'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Paid by <strong>{exp.payerName || exp.payer?.name || 'Roommate'}</strong> • {splitCount} people
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {formatCurrency(exp.amount)}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {formatCurrency(perPersonShare)} /ea
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Showing all {filteredExpenses.length} recent home transactions
          </div>
        </div>
      )}
    </div>
  );
};

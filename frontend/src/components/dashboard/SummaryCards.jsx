import React from 'react';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Wallet, Users, Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const SummaryCards = ({ personalBalance, roomTotals }) => {
  const finalBalance = personalBalance?.finalBalance ?? 0;
  const isPositive = finalBalance > 0.01;
  const isNegative = finalBalance < -0.01;
  const isZero = !isPositive && !isNegative;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      
      {/* Net Balance Hero Card */}
      <div
        className="card"
        style={{
          background: isPositive ? 'var(--positive-bg)' : isNegative ? 'var(--negative-bg)' : 'white',
          borderColor: isPositive ? 'var(--positive-border)' : isNegative ? 'var(--negative-border)' : 'var(--border)',
          gridColumn: 'span 1'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your Net Position
          </span>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isPositive ? '#d1fae5' : isNegative ? '#ffe4e6' : '#f1f5f9',
              color: isPositive ? 'var(--positive)' : isNegative ? 'var(--negative)' : 'var(--text-muted)'
            }}
          >
            {isPositive && <ArrowDownLeft size={18} />}
            {isNegative && <ArrowUpRight size={18} />}
            {isZero && <CheckCircle2 size={18} />}
          </div>
        </div>

        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: isPositive ? 'var(--positive)' : isNegative ? 'var(--negative)' : 'var(--text-main)', marginBottom: '0.25rem' }}>
          {formatCurrency(Math.abs(finalBalance))}
        </div>

        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isPositive ? 'var(--positive)' : isNegative ? 'var(--negative)' : 'var(--text-muted)' }}>
          {isPositive ? 'You should receive' : isNegative ? 'You owe flatmates' : 'You are all settled up!'}
        </div>
      </div>

      {/* Total Paid by You */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            You Paid
          </span>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eef2ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {formatCurrency(personalBalance?.totalPaid ?? 0)}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Your actual contribution in room
        </div>
      </div>

      {/* Total Share */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your Share
          </span>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {formatCurrency(personalBalance?.totalShare ?? 0)}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Assigned to you across expenses
        </div>
      </div>

      {/* Room Total */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Room Total
          </span>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {formatCurrency(roomTotals?.totalExpenses ?? 0)}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Across {roomTotals?.memberCount ?? 0} active members
        </div>
      </div>

    </div>
  );
};

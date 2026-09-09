import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Scale, ArrowRightLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from '../../components/common/Logo';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-app-shell" style={{ background: '#ffffff', minHeight: '100vh', padding: '1.5rem 1.25rem' }}>
      {/* Top Brand Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <Logo size={32} showText={true} />
        <button
          onClick={() => navigate('/login')}
          className="btn btn-secondary btn-sm"
          style={{ fontWeight: 700 }}
        >
          Sign In
        </button>
      </div>

      {/* Hero Content */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          <Sparkles size={13} /> Transparent Flat Expenses
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
          Split flat expenses <br />
          <span style={{ color: 'var(--primary)' }}>effortlessly.</span>
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.5, marginBottom: '2rem' }}>
          Track groceries, utilities, and household bills with your roommates. Clear debts in 1 click.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/register')}
            className="btn btn-primary btn-lg btn-full"
          >
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* 3 Core Highlights */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: 0 }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Receipt size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Flexible Expense Splits</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Equal split or custom shares per roommate.</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: 0 }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Scale size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Debt Minimization</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Smart algorithm reduces total payments needed.</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: 0 }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#ccfbf1', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ArrowRightLeft size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Instant Settlements</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Record repayments and bring balances to ₹0.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

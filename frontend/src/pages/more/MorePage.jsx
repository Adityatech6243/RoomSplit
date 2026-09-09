import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRoom } from '../../context/RoomContext';
import { useToast } from '../../context/ToastContext';
import { Users, Home, Settings, User, LogOut, Copy, Check, ChevronRight } from 'lucide-react';

export const MorePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { activeRoom } = useRoom();
  const { addToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const isAdmin = activeRoom?.role === 'ADMIN' || activeRoom?.currentUserRole === 'ADMIN';

  const handleCopyCode = (e) => {
    e.stopPropagation();
    if (activeRoom?.roomCode) {
      navigator.clipboard.writeText(activeRoom.roomCode);
      setCopied(true);
      addToast(`Room code copied!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>Menu & More</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
          Household management and profile preferences.
        </p>
      </div>

      {/* Active Room Card */}
      {activeRoom && (
        <div
          className="card"
          style={{
            padding: '1rem',
            marginBottom: '1.25rem',
            background: 'var(--primary-light)',
            border: '1.5px solid var(--primary-border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Current Active Flat
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                background: isAdmin ? '#fef3c7' : '#ffffff',
                color: isAdmin ? '#b45309' : 'var(--primary)'
              }}
            >
              {isAdmin ? 'ADMIN' : 'MEMBER'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {activeRoom.roomName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                <span>Code: <strong style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{activeRoom.roomCode}</strong></span>
                <span onClick={handleCopyCode} style={{ cursor: 'pointer', display: 'inline-flex' }}>
                  {copied ? <Check size={13} color="var(--positive)" /> : <Copy size={13} />}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/rooms')}
              className="btn btn-secondary btn-sm"
              style={{ background: '#ffffff' }}
            >
              Switch
            </button>
          </div>
        </div>
      )}

      {/* Navigation Options List */}
      <div className="card" style={{ padding: '0.5rem', marginBottom: '1.25rem' }}>
        <div
          onClick={() => navigate('/members')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', borderBottom: '1px solid var(--border-light)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Room Members</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>View, invite, and manage flatmates</div>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>

        <div
          onClick={() => navigate('/rooms')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', borderBottom: isAdmin ? '1px solid var(--border-light)' : 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>My Rooms & Flats</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Create, join, and switch household flats</div>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>

        {isAdmin && (
          <div
            onClick={() => navigate('/room-settings')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Room Settings (Admin)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rename flat & preferences</div>
              </div>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>
        )}
      </div>

      {/* User Account Section */}
      <div className="card" style={{ padding: '0.5rem', marginBottom: '1.25rem' }}>
        <div
          onClick={() => navigate('/profile')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>My Profile</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser?.name} ({currentUser?.email})</div>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={logout}
        className="btn btn-secondary btn-full"
        style={{ color: 'var(--negative)', borderColor: 'var(--negative-border)', padding: '0.75rem' }}
      >
        <LogOut size={16} />
        <span>Sign Out</span>
      </button>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        RoomSplit App v1.0.0 • Mobile Experience
      </div>
    </div>
  );
};

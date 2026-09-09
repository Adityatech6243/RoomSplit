import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../../context/RoomContext';
import { useToast } from '../../context/ToastContext';
import { roomService } from '../../services/roomService';
import { KeyRound, Copy, Check, ShieldAlert, Save, ArrowLeft } from 'lucide-react';

export const RoomSettingsPage = () => {
  const { activeRoom, updateActiveRoom } = useRoom();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState(activeRoom?.roomName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const isAdmin = activeRoom?.role === 'ADMIN' || activeRoom?.currentUserRole === 'ADMIN';

  if (!isAdmin) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
        <ShieldAlert size={36} color="var(--warning)" style={{ margin: '0 auto 0.75rem' }} />
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Admin Access Only</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Only the Room Admin who created this flat can update its settings.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const updated = await roomService.updateRoom(activeRoom.id, { roomName: roomName.trim() });
      updateActiveRoom(updated);
      addToast('Room settings saved successfully!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update room.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (activeRoom?.roomCode) {
      navigator.clipboard.writeText(activeRoom.roomCode);
      setCopied(true);
      addToast('Room code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard')}
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
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>Room Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
          Manage room name & flat configuration.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>General Details</div>

        {error && (
          <div style={{ padding: '0.75rem', background: 'var(--negative-bg)', color: 'var(--negative)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Room / Flat Name</label>
            <input
              type="text"
              className="form-input"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            <Save size={16} />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* Invite Code Box */}
      <div className="card">
        <div style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.35rem' }}>Invite Code</div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Share this code with roommates so they can join {activeRoom?.roomName}.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <KeyRound size={18} color="var(--primary)" />
            <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--primary)' }}>
              {activeRoom?.roomCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="btn btn-secondary btn-sm"
          >
            {copied ? <Check size={14} color="var(--positive)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

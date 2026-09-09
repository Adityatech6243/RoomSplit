import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../../context/RoomContext';
import { useToast } from '../../context/ToastContext';
import { roomService } from '../../services/roomService';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Home, Plus, KeyRound, Copy, Check, CheckCircle2 } from 'lucide-react';

export const RoomsPage = () => {
  const { myRooms, activeRoom, switchRoom, refreshRooms } = useRoom();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const created = await roomService.createRoom({ roomName: roomName.trim() });
      await refreshRooms();
      switchRoom(created.id);
      addToast(`Room "${created.roomName}" created!`, 'success');
      setCreateModalOpen(false);
      setRoomName('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create room.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      const joined = await roomService.joinRoom({ roomCode: roomCode.trim().toUpperCase() });
      await refreshRooms();
      switchRoom(joined.id);
      addToast(`Joined room "${joined.roomName}"!`, 'success');
      setJoinModalOpen(false);
      setRoomCode('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to join room.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Room code ${code} copied!`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>My Rooms</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
            Switch between household rooms or create a flat.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => { setError(''); setJoinModalOpen(true); }}
            className="btn btn-secondary btn-sm"
          >
            <KeyRound size={14} />
            <span>Join</span>
          </button>
          <button
            onClick={() => { setError(''); setCreateModalOpen(true); }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} />
            <span>New</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {myRooms.map((room) => {
          const isActive = room.id === activeRoom?.id;
          const isAdmin = room.role === 'ADMIN' || room.currentUserRole === 'ADMIN';

          return (
            <div
              key={room.id}
              className="card"
              onClick={() => {
                if (!isActive) {
                  switchRoom(room.id);
                  addToast(`Switched to "${room.roomName}"`, 'info');
                  navigate('/dashboard');
                }
              }}
              style={{
                border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: isActive ? 'var(--primary-light)' : '#ffffff',
                padding: '1rem',
                marginBottom: 0,
                cursor: isActive ? 'default' : 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--primary)' : '#e2e8f0',
                      color: isActive ? '#ffffff' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Home size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{room.roomName}</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Code: <strong style={{ fontFamily: 'monospace' }}>{room.roomCode}</strong>
                      <span onClick={(e) => handleCopy(room.roomCode, e)} style={{ marginLeft: '0.35rem', cursor: 'pointer', display: 'inline-flex', verticalAlign: 'middle' }}>
                        {copiedCode === room.roomCode ? <Check size={12} color="var(--positive)" /> : <Copy size={12} />}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: isAdmin ? '#fef3c7' : '#f1f5f9',
                      color: isAdmin ? '#b45309' : '#64748b'
                    }}
                  >
                    {isAdmin ? 'ADMIN' : 'MEMBER'}
                  </span>

                  {isActive && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <CheckCircle2 size={14} /> Active
                    </span>
                  )}
                </div>
              </div>

              {!isActive && (
                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                    Tap to switch →
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Room Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create a New Flat">
        {error && (
          <div style={{ padding: '0.6rem', background: 'var(--negative-bg)', color: 'var(--negative)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleCreate}>
          <Input
            id="rooms-create-name"
            label="Room / Flat Name"
            placeholder="e.g. Pune Flat 402"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            autoFocus
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setCreateModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Flat'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Join Room Modal */}
      <Modal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} title="Join Existing Flat">
        {error && (
          <div style={{ padding: '0.6rem', background: 'var(--negative-bg)', color: 'var(--negative)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleJoin}>
          <Input
            id="rooms-join-code"
            label="Room Code"
            placeholder="e.g. RM7K42P"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            required
            autoFocus
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={() => setJoinModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Joining...' : 'Join Flat'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

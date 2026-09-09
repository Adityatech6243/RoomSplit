import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, KeyRound, Plus, Users, Copy, Check, ArrowRight } from 'lucide-react';
import { roomService } from '../../services/roomService';
import { useRoom } from '../../context/RoomContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const OnboardingPage = () => {
  const { refreshRooms, switchRoom } = useRoom();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState('choice'); // 'choice' | 'create' | 'join' | 'created_success'
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [createdRoom, setCreatedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setError('Please provide a room name.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const newRoom = await roomService.createRoom({ roomName: roomName.trim() });
      setCreatedRoom(newRoom);
      await refreshRooms();
      switchRoom(newRoom.id);
      addToast(`Room "${newRoom.roomName}" created!`, 'success');
      setMode('created_success');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create room.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError('Please enter the room code.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const joinedRoom = await roomService.joinRoom({ roomCode: roomCode.trim().toUpperCase() });
      await refreshRooms();
      switchRoom(joinedRoom.id);
      addToast(`Joined "${joinedRoom.roomName}" successfully!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid room code.');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (createdRoom?.roomCode) {
      navigator.clipboard.writeText(createdRoom.roomCode);
      setCopied(true);
      addToast('Room code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)' }}>
      <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '2.5rem' }}>
        
        {/* State 1: Choose Create vs Join */}
        {mode === 'choice' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div className="brand-icon" style={{ width: '48px', height: '48px', margin: '0 auto 1rem', fontSize: '1.3rem' }}>RS</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Welcome, {currentUser?.name?.split(' ')[0]}!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.35rem' }}>
                To start tracking shared groceries & expenses, join an existing flat or create a new room.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                onClick={() => setMode('create')}
                style={{
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: 'white'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <Plus size={22} />
                </div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Create Room</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Start a new flat and get a unique room code to invite flatmates</p>
              </div>

              <div
                onClick={() => setMode('join')}
                style={{
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: 'white'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ecfdf5', color: 'var(--positive)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <KeyRound size={22} />
                </div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Join Room</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Enter the code shared by your flatmate (e.g. RM7K42P)</p>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Create Form */}
        {mode === 'create' && (
          <div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>Create a New Room</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Give your household a recognizable name (e.g. "Pune Flat 402" or "Koramangala Flat")
            </p>

            {error && (
              <div style={{ padding: '0.75rem 1rem', background: 'var(--negative-bg)', color: 'var(--negative)', border: '1px solid var(--negative-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleCreateRoom}>
              <Input
                id="create-room-name"
                label="Room Name"
                icon={Home}
                placeholder="e.g. Pune Flat 402"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                autoFocus
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <Button variant="secondary" onClick={() => setMode('choice')} disabled={loading}>
                  Back
                </Button>
                <Button type="submit" variant="primary" loading={loading} icon={Plus}>
                  Create Room
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* State 3: Join Form */}
        {mode === 'join' && (
          <div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>Join an Existing Room</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Enter the unique room code shared with you
            </p>

            {error && (
              <div style={{ padding: '0.75rem 1rem', background: 'var(--negative-bg)', color: 'var(--negative)', border: '1px solid var(--negative-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleJoinRoom}>
              <Input
                id="join-room-code"
                label="Room Code"
                icon={KeyRound}
                placeholder="e.g. RM7K42P"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                required
                autoFocus
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <Button variant="secondary" onClick={() => setMode('choice')} disabled={loading}>
                  Back
                </Button>
                <Button type="submit" variant="primary" loading={loading} icon={KeyRound}>
                  Join Room
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* State 4: Room Created Success & Share Code */}
        {mode === 'created_success' && createdRoom && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ecfdf5', color: 'var(--positive)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Check size={30} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Room Created Successfully!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
              Share this unique room code with your roommates so they can join:
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: '#f1f5f9', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--primary)' }}>
                {createdRoom.roomCode}
              </span>
              <Button size="sm" variant="secondary" onClick={copyCode} icon={copied ? Check : Copy}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>

            <div>
              <Button size="lg" variant="primary" icon={ArrowRight} onClick={() => navigate('/dashboard')} style={{ width: '100%' }}>
                Go to Room Dashboard
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

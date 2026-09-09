import React, { useState } from 'react';
import { ChevronDown, Bell, Copy, Check, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../../context/RoomContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Logo } from '../common/Logo';
import { Modal } from '../common/Modal';
import { getInitials } from '../../utils/formatters';

export const Header = () => {
  const { activeRoom, myRooms, switchRoom } = useRoom();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e) => {
    e.stopPropagation();
    if (activeRoom?.roomCode) {
      navigator.clipboard.writeText(activeRoom.roomCode);
      setCopied(true);
      addToast(`Room code ${activeRoom.roomCode} copied!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <header className="app-top-header">
        {/* Left: Logo & Room Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <Logo size={26} showText={false} />
          </div>

          {activeRoom ? (
            <div
              onClick={() => setRoomModalOpen(true)}
              style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
                <span>{activeRoom.roomName}</span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                <span>{activeRoom.roomCode}</span>
                <span onClick={handleCopyCode} title="Copy code" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {copied ? <Check size={11} color="var(--positive)" /> : <Copy size={11} />}
                </span>
              </div>
            </div>
          ) : (
            <div onClick={() => navigate('/rooms')} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', cursor: 'pointer' }}>
              Select / Create Room
            </div>
          )}
        </div>

        {/* Right: Notifications & User Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => addToast('You are all caught up!', 'info')}
            aria-label="Notifications"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.35rem',
              color: 'var(--text-main)'
            }}
          >
            <Bell size={20} />
          </button>

          <div
            onClick={() => navigate('/profile')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1.5px solid #ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {getInitials(currentUser?.name || 'U')}
          </div>
        </div>
      </header>

      {/* Switch Room Modal */}
      <Modal isOpen={roomModalOpen} onClose={() => setRoomModalOpen(false)} title="Switch Household Room">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {myRooms.map((r) => {
            const isCurrent = r.id === activeRoom?.id;
            return (
              <div
                key={r.id}
                onClick={() => {
                  switchRoom(r.id);
                  setRoomModalOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isCurrent ? 'var(--primary-light)' : 'white',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Home size={18} color={isCurrent ? 'var(--primary)' : 'var(--text-muted)'} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{r.roomName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      Code: {r.roomCode}
                    </div>
                  </div>
                </div>
                {isCurrent && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                    Active
                  </span>
                )}
              </div>
            );
          })}

          <button
            onClick={() => {
              setRoomModalOpen(false);
              navigate('/rooms');
            }}
            className="btn btn-secondary"
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            Manage All Rooms
          </button>
        </div>
      </Modal>
    </>
  );
};

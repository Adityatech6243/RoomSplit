import React, { useState, useEffect, useCallback } from 'react';
import { useRoom } from '../../context/RoomContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { roomService } from '../../services/roomService';
import { getInitials, formatDate } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Skeleton } from '../../components/common/Skeleton';
import { UserMinus, Mail, Calendar, Copy, Check } from 'lucide-react';

export const RoomMembersPage = () => {
  const { activeRoom, refreshRooms } = useRoom();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadMembers = useCallback(async () => {
    if (!activeRoom?.id) return;
    setLoading(true);
    try {
      const data = await roomService.getRoomMembers(activeRoom.id);
      setMembers(data || []);
    } catch (err) {
      console.error('Failed to load room members:', err);
    } finally {
      setLoading(false);
    }
  }, [activeRoom?.id]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const isAdmin = activeRoom?.role === 'ADMIN' || activeRoom?.currentUserRole === 'ADMIN';

  const handleCopyCode = () => {
    if (activeRoom?.roomCode) {
      navigator.clipboard.writeText(activeRoom.roomCode);
      setCopied(true);
      addToast(`Invite code ${activeRoom.roomCode} copied!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;
    setRemoving(true);
    try {
      await roomService.removeMember(activeRoom.id, memberToRemove.userId);
      addToast(`${memberToRemove.name} has been removed from ${activeRoom.roomName}.`, 'info');
      await loadMembers();
      await refreshRooms();
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to remove member.', 'error');
    } finally {
      setRemoving(false);
      setMemberToRemove(null);
    }
  };

  return (
    <div>
      {/* Header & Quick Invite Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Room Members</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Manage and view flatmates in <strong>{activeRoom?.roomName}</strong> ({members.length} members)
          </p>
        </div>

        {activeRoom && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Button variant="secondary" size="md" icon={copied ? Check : Copy} onClick={handleCopyCode}>
              {copied ? 'Code Copied' : `Invite Code: ${activeRoom.roomCode}`}
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Skeleton height="80px" borderRadius="var(--radius-md)" />
          <Skeleton height="80px" borderRadius="var(--radius-md)" />
          <Skeleton height="80px" borderRadius="var(--radius-md)" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {members.map(member => {
            const isYou = member.userId === currentUser?.id;
            const isMemberAdmin = member.role === 'ADMIN';

            return (
              <div
                key={member.userId}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  borderLeft: isMemberAdmin ? '4px solid #f59e0b' : (isYou ? '4px solid var(--primary)' : '1px solid var(--border)')
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: isMemberAdmin ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#e2e8f0', color: isMemberAdmin ? 'white' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700 }}>
                    {getInitials(member.name)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{member.name}</span>
                      {isYou && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>(You)</span>}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                      <Mail size={13} /> {member.email}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                      <Calendar size={13} /> Joined {formatDate(member.joinedAt)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <Badge variant={isMemberAdmin ? 'admin' : 'member'}>
                    {member.role}
                  </Badge>

                  {/* Admin can remove non-admin members */}
                  {isAdmin && !isYou && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      icon={UserMinus}
                      onClick={() => setMemberToRemove(member)}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog for Member Removal */}
      <ConfirmDialog
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleConfirmRemove}
        title="Remove Member from Room"
        message={`Are you sure you want to remove ${memberToRemove?.name} from "${activeRoom?.roomName}"? They will lose access to this room, but historical expense records will remain preserved.`}
        confirmText="Remove Member"
        confirmVariant="danger"
        loading={removing}
      />
    </div>
  );
};

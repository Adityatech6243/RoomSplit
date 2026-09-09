import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { getInitials } from '../../utils/formatters';

export const ParticipantSelector = ({
  members = [],
  selectedUserIds = [],
  onChange,
  error
}) => {
  const isAllSelected = members.length > 0 && selectedUserIds.length === members.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(members.map(m => m.userId));
    }
  };

  const handleToggle = (userId) => {
    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter(id => id !== userId));
    } else {
      onChange([...selectedUserIds, userId]);
    }
  };

  return (
    <div className="form-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          Participating Roommates ({selectedUserIds.length} of {members.length} selected)
        </label>
        <button
          type="button"
          onClick={handleToggleAll}
          style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
        >
          {isAllSelected ? <CheckSquare size={14} /> : <Square size={14} />}
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
        {members.map(member => {
          const isSelected = selectedUserIds.includes(member.userId);
          return (
            <div
              key={member.userId}
              onClick={() => handleToggle(member.userId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                background: isSelected ? 'var(--primary-light)' : 'white',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}} // handled by parent div
                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--primary)' : '#e2e8f0',
                  color: isSelected ? 'white' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {getInitials(member.name || member.userName)}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: isSelected ? 600 : 500, color: 'var(--text-main)' }}>
                {member.name || member.userName}
              </span>
            </div>
          );
        })}
      </div>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import { getInitials } from '../../utils/formatters';
import { Save, LogOut } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateUser, logout } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updated = await userService.updateProfile({
        name: name.trim(),
        phone: phone.trim()
      });
      updateUser(updated);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>My Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
          Your personal account & contact details.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 800
            }}
          >
            {getInitials(currentUser?.name || 'U')}
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{currentUser?.name}</h2>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: 'var(--negative-bg)', color: 'var(--negative)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Login ID)</label>
            <input
              type="email"
              className="form-input"
              value={currentUser?.email || ''}
              disabled
              style={{ background: '#f8fafc', color: 'var(--text-muted)' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="tel"
              className="form-input"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            <Save size={18} />
            <span>{loading ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </form>
      </div>

      {/* Sign Out Card */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Sign Out</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disconnect current session.</div>
        </div>
        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ color: 'var(--negative)', borderColor: 'var(--negative-border)' }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

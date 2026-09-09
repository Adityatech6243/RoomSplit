import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Logo } from '../../components/common/Logo';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register({ name, email, phone, password });
      addToast('Account created successfully! Welcome to RoomSplit.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-app-shell" style={{ justifyContent: 'center', padding: '1.5rem', background: '#f4f6f8' }}>
      <div className="card" style={{ padding: '2rem 1.5rem', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.875rem' }}>
            <Logo size={42} showText={true} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Join RoomSplit to collaborate on household expenses
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'var(--negative-bg)', color: 'var(--negative)', border: '1px solid var(--negative-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            id="reg-name"
            name="name"
            label="Full Name"
            icon={User}
            placeholder="Aditya Patil"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            id="reg-email"
            name="email"
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="aditya@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            id="reg-phone"
            name="phone"
            label="Phone Number (Optional)"
            type="tel"
            icon={Phone}
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            id="reg-pass"
            name="password"
            label="Password"
            type="password"
            icon={Lock}
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            id="reg-conf"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            icon={Lock}
            placeholder="Repeat password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

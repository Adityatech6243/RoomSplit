import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Scale,
  ArrowRightLeft,
  Users,
  Settings,
  User,
  Home,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRoom } from '../../context/RoomContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { activeRoom, myRooms, switchRoom } = useRoom();

  const isAdmin = activeRoom?.role === 'ADMIN' || activeRoom?.currentUserRole === 'ADMIN';

  return (
    <>
      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 35
          }}
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">RS</div>
          <div className="brand-text">RoomSplit</div>
        </div>

        {/* Room Context Selector */}
        <div className="room-selector-widget">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Room
            </span>
            {activeRoom && (
              <span style={{ fontSize: '0.6875rem', color: '#38bdf8', background: '#0369a1', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                {activeRoom.role}
              </span>
            )}
          </div>
          {myRooms && myRooms.length > 0 ? (
            <select
              value={activeRoom ? activeRoom.id : ''}
              onChange={(e) => switchRoom(e.target.value)}
              style={{
                width: '100%',
                background: '#0f172a',
                color: 'white',
                border: '1px solid #334155',
                padding: '0.45rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              {myRooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.roomName}
                </option>
              ))}
            </select>
          ) : (
            <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>No rooms joined</div>
          )}
        </div>

        {/* Navigation items */}
        <nav className="nav-menu">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Receipt size={18} />
            <span>Expenses</span>
          </NavLink>

          <NavLink
            to="/balances"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Scale size={18} />
            <span>Balances</span>
          </NavLink>

          <NavLink
            to="/settlements"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <ArrowRightLeft size={18} />
            <span>Settlements</span>
          </NavLink>

          <NavLink
            to="/members"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Users size={18} />
            <span>Members</span>
          </NavLink>

          <NavLink
            to="/rooms"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Home size={18} />
            <span>My Rooms</span>
          </NavLink>

          {/* Admin only route */}
          {isAdmin && (
            <NavLink
              to="/room-settings"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Settings size={18} />
              <span>Room Settings</span>
            </NavLink>
          )}

          <div style={{ margin: '0.5rem 0', borderTop: '1px solid #1e293b' }} />

          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <User size={18} />
            <span>My Profile</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.625rem 0.875rem',
              color: '#ef4444',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#1e293b')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Receipt, Plus, Wallet, ArrowRightLeft, Menu } from 'lucide-react';

export const MobileNav = () => {
  return (
    <nav className="bottom-nav-bar" aria-label="Bottom Navigation">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `nav-tab-item ${isActive ? 'active' : ''}`}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/expenses"
        className={({ isActive }) => `nav-tab-item ${isActive ? 'active' : ''}`}
      >
        <Receipt size={20} />
        <span>Expenses</span>
      </NavLink>

      {/* Elevated Center Action FAB Button */}
      <NavLink
        to="/expenses/new"
        className="floating-add-btn"
        aria-label="Add Expense"
      >
        <Plus size={26} strokeWidth={2.5} />
      </NavLink>

      <NavLink
        to="/balances"
        className={({ isActive }) => `nav-tab-item ${isActive ? 'active' : ''}`}
      >
        <Wallet size={20} />
        <span>Balances</span>
      </NavLink>

      <NavLink
        to="/settlements"
        className={({ isActive }) => `nav-tab-item ${isActive ? 'active' : ''}`}
      >
        <ArrowRightLeft size={20} />
        <span>Settlements</span>
      </NavLink>

      <NavLink
        to="/more"
        className={({ isActive }) => `nav-tab-item ${isActive ? 'active' : ''}`}
      >
        <Menu size={20} />
        <span>More</span>
      </NavLink>
    </nav>
  );
};

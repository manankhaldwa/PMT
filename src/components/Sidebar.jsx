import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiBriefcase, FiUsers, FiCalendar, FiSettings,
  FiMenu, FiChevronDown, FiChevronRight, FiLogOut
} from 'react-icons/fi';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const location = useLocation();

  // Sample companies for submenu
  const companies = [
    { id: 'c1', name: 'Company One' },
    { id: 'c2', name: 'Company Two' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Hamburger button (only if sidebar closed) */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg"
          aria-label="Open sidebar"
        >
          <FiMenu className="h-6 w-6 text-gray-600" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
        transition-transform duration-300 ease-in-out flex flex-col`}>

        {/* Close button on mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden self-start m-4 p-2 rounded-md bg-white shadow-lg"
          aria-label="Close sidebar"
        >
          <FiMenu className="h-6 w-6 text-gray-600" />
        </button>

        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600 truncate">ProjectCollab</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex items-center p-3 rounded-lg transition-colors
              ${location.pathname === '/dashboard' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => setMobileOpen(false)}
          >
            <FiHome className="mr-3" />
            Dashboard
          </Link>

          {/* Companies submenu */}
          <div>
            <button
              onClick={() => setCompaniesOpen(!companiesOpen)}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <div className="flex items-center">
                <FiBriefcase className="mr-3" />
                Companies
              </div>
              {companiesOpen
                ? <FiChevronDown className="text-sm" />
                : <FiChevronRight className="text-sm" />}
            </button>

            {companiesOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {companies.map(company => (
                  <Link
                    key={company.id}
                    to={`/companies/${company.id}`}
                    className={`block p-2 rounded-lg text-sm transition-colors
                      ${location.pathname === `/companies/${company.id}`
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {company.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Team */}
          <Link
            to="/team"
            className={`flex items-center p-3 rounded-lg transition-colors
              ${location.pathname === '/team' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => setMobileOpen(false)}
          >
            <FiUsers className="mr-3" />
            Team
          </Link>

          {/* Calendar */}
          <Link
            to="/calendar"
            className={`flex items-center p-3 rounded-lg transition-colors
              ${location.pathname === '/calendar' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => setMobileOpen(false)}
          >
            <FiCalendar className="mr-3" />
            Calendar
          </Link>

          {/* Settings */}
          <Link
            to="/settings"
            className={`flex items-center p-3 rounded-lg transition-colors
              ${location.pathname === '/settings' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => setMobileOpen(false)}
          >
            <FiSettings className="mr-3" />
            Settings
          </Link>
        </nav>

        {/* User & Logout at bottom */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-medium">
                {auth.currentUser?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 truncate max-w-[160px]">
                {auth.currentUser?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            title="Logout"
          >
            <FiLogOut />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
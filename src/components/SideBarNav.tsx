import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Users, Settings, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AppContext';

export interface SideBarNavProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isMobile?: boolean;
}

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles: ('admin' | 'librarian' | 'user')[];
};

const navItems: NavItem[] = [
  {
    to: '/',
    label: 'Overview',
    icon: <Home className="h-4 w-4" />,
    roles: ['admin', 'librarian', 'user'],
  },
  {
    to: '/catalog',
    label: 'Catalog',
    icon: <BookOpen className="h-4 w-4" />,
    roles: ['admin', 'librarian', 'user'],
  },
  {
    to: '/members',
    label: 'Members',
    icon: <Users className="h-4 w-4" />,
    roles: ['admin', 'librarian'],
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    roles: ['admin'],
  },
];

export function SideBarNav({
  open = true,
  onOpenChange = () => {},
  isMobile = false,
}: SideBarNavProps) {
  const { role } = useAuth() ?? {};
  const location = useLocation();
  const isOverlay = isMobile ?? false;

  const content = (
    <div className="flex h-full flex-col bg-[#001a33] text-slate-100 shadow-xl">
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#003366] text-xs font-semibold tracking-widest uppercase">
            CL
          </span>
          <div className="flex flex-col">
            <span className="font-['Playfair_Display'] text-sm tracking-tight">
              Conestoga
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Library
            </span>
          </div>
        </div>
        {isOverlay ? (
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-600/60 text-slate-200 hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#001a33] focus:ring-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onOpenChange(!open)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-600/60 text-slate-200 hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#001a33] focus:ring-slate-300"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems
          .filter((item) => (role ?? 'user') && item.roles.includes(role ?? 'user'))
          .map((item) => {
            const active = location?.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-slate-100 text-[#003366]'
                    : 'text-slate-200 hover:bg-slate-800/70 hover:text-white'
                )}
                onClick={() => {
                  if (isOverlay) {
                    onOpenChange(false);
                  }
                }}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-[9px] border text-xs transition-colors',
                    active
                      ? 'border-[#003366]/20 bg-[#003366]/10 text-[#003366]'
                      : 'border-slate-600/70 bg-slate-900/40 text-slate-200 group-hover:border-slate-400'
                  )}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
      </nav>
      <div className="border-t border-slate-700/70 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
        <div className="flex items-center justify-between">
          <span>Role</span>
          <span className="text-slate-200">{(role ?? 'user').toUpperCase()}</span>
        </div>
      </div>
    </div>
  );

  if (isOverlay) {
    return (
      <AnimatePresence>
        {open ? (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed inset-y-0 left-0 z-40 w-72 max-w-full"
          >
            {content}
          </motion.aside>
        ) : null}
      </AnimatePresence>
    );
  }

  return (
    <aside
      className={cn(
        'relative z-30 h-full border-r border-slate-800/70 bg-[#001a33] transition-[width] duration-300 ease-out',
        open ? 'w-72' : 'w-16'
      )}
    >
      <div className={cn('h-full', !open && 'overflow-hidden')}>
        {content}
      </div>
    </aside>
  );
}

export default SideBarNav;
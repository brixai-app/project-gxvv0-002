import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Menu, Search, Circle as LogOut, User as UserIcon, Home } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export interface TopNavBarProps {
  onSidebarToggle?: () => void;
}

export function TopNavBar({ onSidebarToggle = () => {} }: TopNavBarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials =
    user?.name
      ?.split(' ')
      ?.map((n) => n?.[0] ?? '')
      ?.join('')
      ?.toUpperCase() ?? 'CL';

  const isActivePath = (path: string) =>
    (location?.pathname ?? '') === path;

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-[#B0B8C1]/50 bg-[#003366] text-white">
      <div className="flex h-full items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => onSidebarToggle()}
            className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-1.5 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            to="/"
            className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-[#003366] shadow-sm"
            >
              <BookOpen className="h-5 w-5" />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="font-['Playfair_Display'] text-sm font-semibold tracking-wide">
                Conestoga Library
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-200/80">
                Remote Catalog
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-[999px] bg-white/5 px-3 py-1.5 text-xs text-slate-100/80 backdrop-blur sm:flex">
            <Search className="mr-1 h-3.5 w-3.5 opacity-80" />
            <span className="font-medium tracking-[0.18em] uppercase">
              Quick search
            </span>
            <span className="ml-2 rounded-sm border border-white/30 px-1.5 py-0.5 text-[10px] font-semibold tracking-widest">
              /
            </span>
          </div>

          <nav className="hidden items-center gap-1.5 text-xs font-medium tracking-[0.18em] uppercase sm:flex">
            <Link
              to="/"
              className={cn(
                'rounded-md px-2.5 py-1.5 transition-colors',
                isActivePath('/')
                  ? 'bg-white text-[#003366]'
                  : 'text-slate-100/80 hover:bg-white/10'
              )}
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className={cn(
                'rounded-md px-2.5 py-1.5 transition-colors',
                isActivePath('/catalog')
                  ? 'bg-white text-[#003366]'
                  : 'text-slate-100/80 hover:bg-white/10'
              )}
            >
              Catalog
            </Link>
          </nav>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 rounded-[999px] border border-white/20 bg-white/5 px-2.5 py-1.5 text-left text-xs text-slate-50 shadow-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#003366] text-xs font-semibold">
                  {user?.avatarUrl ? (
                    <img
                      src={user?.avatarUrl ?? ''}
                      crossOrigin="anonymous"
                      alt={user?.name ?? 'User avatar'}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="hidden flex-col leading-tight sm:flex">
                  <span className="max-w-[120px] truncate text-[11px] font-semibold">
                    {user?.name ?? 'Guest'}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-slate-100/70">
                    {(user?.role ?? 'user') === 'admin'
                      ? 'Admin'
                      : (user?.role ?? 'user') === 'librarian'
                      ? 'Librarian'
                      : 'Member'}
                  </span>
                </div>
              </motion.button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                side="bottom"
                align="end"
                sideOffset={8}
                className="z-50 min-w-[180px] rounded-[14px] border border-[#B0B8C1]/50 bg-white/95 p-1.5 text-sm shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-2.5 rounded-[10px] px-2 py-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003366]/5 text-[11px] font-semibold text-[#003366]">
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="max-w-[140px] truncate text-xs font-medium text-[#0B1220]">
                      {user?.name ?? 'Guest User'}
                    </span>
                    <span className="max-w-[140px] truncate text-[11px] text-[#4B5563]">
                      {user?.email ?? 'Not signed in'}
                    </span>
                  </div>
                </div>
                <DropdownMenu.Separator className="my-1 h-px bg-slate-200" />
                <DropdownMenu.Item
                  className="flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-1.5 text-xs text-[#0B1220] outline-none hover:bg-[#F6F8FB]"
                  onSelect={(e) => {
                    e?.preventDefault?.();
                    navigate('/profile');
                  }}
                >
                  <UserIcon className="h-4 w-4 text-[#4B5563]" />
                  <span>Profile</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-1.5 text-xs text-[#0B1220] outline-none hover:bg-[#F6F8FB]"
                  onSelect={(e) => {
                    e?.preventDefault?.();
                    navigate('/');
                  }}
                >
                  <Home className="h-4 w-4 text-[#4B5563]" />
                  <span>Dashboard</span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-slate-200" />
                <DropdownMenu.Item
                  disabled={!isAuthenticated}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-1.5 text-xs outline-none',
                    isAuthenticated
                      ? 'text-[#0B1220] hover:bg-[#F6F8FB]'
                      : 'cursor-not-allowed text-slate-400'
                  )}
                  onSelect={(e) => {
                    e?.preventDefault?.();
                    if (!isAuthenticated) return;
                    handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4 text-[#4B5563]" />
                  <span>{isAuthenticated ? 'Sign out' : 'Signed out'}</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}

export default TopNavBar;
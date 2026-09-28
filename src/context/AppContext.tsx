import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { toast } from 'sonner';
import {
  AuthContextState,
  AuthContextValue,
  AuthStoredState,
  Book,
  Checkout,
  HoldRequest,
  ID,
  Role,
  User,
} from '@/types';
import {
  mockUsers,
  mockBooks,
  mockCheckouts,
  mockHoldRequests,
  computeBookStatus,
} from '@/data/mockData';

type AppContextState = AuthContextValue & {
  books: Book[];
  users: User[];
  checkouts: Checkout[];
  holds: HoldRequest[];
  hasRole: (roles: Role | Role[]) => boolean;
  requireRole: (roles: Role | Role[], actionLabel?: string) => boolean;
  checkoutBook: (bookId: ID) => Promise<void>;
  returnBook: (checkoutId: ID) => Promise<void>;
  placeHold: (bookId: ID) => Promise<void>;
  cancelHold: (holdId: ID) => Promise<void>;
  updateUser: (userId: ID, partial: Partial<User>) => Promise<void>;
};

const STORAGE_KEY = 'conestoga_auth_v1';

const AppContext = createContext<AppContextState | undefined>(undefined);

function getStoredAuth(): AuthStoredState {
  if (typeof window === 'undefined') return { userId: null, email: null, role: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { userId: null, email: null, role: null };
    const parsed = JSON.parse(raw) as AuthStoredState;
    return {
      userId: parsed?.userId ?? null,
      email: parsed?.email ?? null,
      role: parsed?.role ?? null,
    };
  } catch {
    return { userId: null, email: null, role: null };
  }
}

function setStoredAuth(state: AuthStoredState | null) {
  if (typeof window === 'undefined') return;
  if (!state) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function AppProvider({ children }: { children?: ReactNode }) {
  const [authState, setAuthState] = useState<AuthContextState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [books, setBooks] = useState<Book[]>(() => [...mockBooks]);
  const [users, setUsers] = useState<User[]>(() => [...mockUsers]);
  const [checkouts, setCheckouts] = useState<Checkout[]>(() => [...mockCheckouts]);
  const [holds, setHolds] = useState<HoldRequest[]>(() => [...mockHoldRequests]);

  useEffect(() => {
    const stored = getStoredAuth();
    if (!stored?.userId) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return;
    }
    const existing = mockUsers.find((u) => u.id === stored.userId);
    if (!existing) {
      setStoredAuth(null);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    setAuthState({ user: existing, isAuthenticated: true, isLoading: false });
  }, []);

  const login = useCallback(async (email?: string, role?: Role) => {
    const targetEmail = email ?? 'reader@conestoga.test';
    const targetRole: Role = role ?? 'user';
    const existing =
      mockUsers.find((u) => u.email.toLowerCase() === targetEmail.toLowerCase()) ??
      mockUsers[0];

    const updated: User = { ...existing, role: targetRole };
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

    setAuthState({ user: updated, isAuthenticated: true, isLoading: false });
    setStoredAuth({ userId: updated.id, email: updated.email, role: updated.role });
    toast.success(`Signed in as ${updated.role}`);
  }, []);

  const logout = useCallback(async () => {
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    setStoredAuth(null);
    toast.info('Signed out');
  }, []);

  const hasRole = useCallback(
    (roles: Role | Role[]) => {
      const list = Array.isArray(roles) ? roles : [roles];
      const current = authState.user?.role ?? null;
      return !!current && list.includes(current);
    },
    [authState.user?.role],
  );

  const requireRole = useCallback(
    (roles: Role | Role[], actionLabel?: string) => {
      if (!authState.isAuthenticated) {
        toast.error('Please sign in to continue.');
        return false;
      }
      const allowed = hasRole(roles);
      if (!allowed) {
        const label = actionLabel ?? 'perform this action';
        toast.error(`Your role cannot ${label}.`);
      }
      return allowed;
    },
    [authState.isAuthenticated, hasRole],
  );

  const checkoutBook = useCallback(
    async (bookId: ID) => {
      if (!requireRole(['admin', 'librarian', 'user'], 'checkout books')) return;
      const userId = authState.user?.id;
      if (!userId) return;
      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId && b.availableCopies > 0
            ? {
                ...b,
                availableCopies: b.availableCopies - 1,
                status: computeBookStatus(b.id, checkouts, holds),
              }
            : b,
        ),
      );
      const now = new Date();
      const due = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      const checkout: Checkout = {
        id: crypto.randomUUID(),
        userId,
        bookId,
        checkedOutAt: now.toISOString(),
        dueAt: due.toISOString(),
        status: 'active',
        renewedCount: 0,
        returnedAt: null,
      };
      setCheckouts((prev) => [...prev, checkout]);
      toast.success('Book checked out');
    },
    [authState.user?.id, checkouts, holds, requireRole],
  );

  const returnBook = useCallback(
    async (checkoutId: ID) => {
      if (!requireRole(['admin', 'librarian', 'user'], 'return books')) return;
      const now = new Date().toISOString();
      setCheckouts((prev) =>
        prev.map((c) =>
          c.id === checkoutId ? { ...c, status: 'returned', returnedAt: now } : c,
        ),
      );
      setBooks((prev) =>
        prev.map((b) => ({
          ...b,
          status: computeBookStatus(b.id, checkouts, holds),
          availableCopies:
            b.id === prev.find((bk) => bk.id === b.id)?.id
              ? Math.min((b.availableCopies ?? 0) + 1, b.totalCopies ?? 0)
              : b.availableCopies,
        })),
      );
      toast.success('Book returned');
    },
    [checkouts, holds, requireRole],
  );

  const placeHold = useCallback(
    async (bookId: ID) => {
      if (!requireRole(['admin', 'librarian', 'user'], 'place holds')) return;
      const userId = authState.user?.id;
      if (!userId) return;
      const existingPositions = holds
        .filter((h) => h.bookId === bookId && h.status === 'active')
        .map((h) => h.position);
      const position = (existingPositions.length ? Math.max(...existingPositions) : 0) + 1;
      const hold: HoldRequest = {
        id: crypto.randomUUID(),
        userId,
        bookId,
        status: 'active',
        position,
        requestedAt: new Date().toISOString(),
        fulfilledAt: null,
        cancelledAt: null,
      };
      setHolds((prev) => [...prev, hold]);
      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId
            ? { ...b, status: computeBookStatus(b.id, checkouts, [...holds, hold]) }
            : b,
        ),
      );
      toast.success('Hold placed');
    },
    [authState.user?.id, checkouts, holds, requireRole],
  );

  const cancelHold = useCallback(
    async (holdId: ID) => {
      if (!requireRole(['admin', 'librarian', 'user'], 'cancel holds')) return;
      const now = new Date().toISOString();
      setHolds((prev) =>
        prev.map((h) =>
          h.id === holdId ? { ...h, status: 'cancelled', cancelledAt: now } : h,
        ),
      );
      toast.info('Hold cancelled');
    },
    [requireRole],
  );

  const updateUser = useCallback(
    async (userId: ID, partial: Partial<User>) => {
      if (!requireRole(['admin', 'librarian'], 'update users')) return;
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...partial, updatedAt: new Date().toISOString() } : u)),
      );
      if (authState.user?.id === userId) {
        setAuthState((prev) => ({
          ...prev,
          user: prev.user ? { ...prev.user, ...partial } : prev.user,
        }));
      }
      toast.success('User updated');
    },
    [authState.user?.id, requireRole],
  );

  const value: AppContextState = useMemo(
    () => ({
      ...authState,
      login,
      logout,
      books,
      users,
      checkouts,
      holds,
      hasRole,
      requireRole,
      checkoutBook,
      returnBook,
      placeHold,
      cancelHold,
      updateUser,
    }),
    [
      authState,
      login,
      logout,
      books,
      users,
      checkouts,
      holds,
      hasRole,
      requireRole,
      checkoutBook,
      returnBook,
      placeHold,
      cancelHold,
      updateUser,
    ],
  );

  return <AppContext.Provider value={value}>{children ?? null}</AppContext.Provider>;
}

export function useAppContext(): AppContextState {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return ctx;
}

export function useAuth(): AuthContextValue {
  const { user, isAuthenticated, isLoading, login, logout } = useAppContext();
  return { user, isAuthenticated, isLoading, login, logout };
}

export default AppContext;
export { AppContext };

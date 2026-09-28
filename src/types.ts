export type ID = string;

export type Role = 'admin' | 'librarian' | 'user';

export interface User {
  id: ID;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  isActive: boolean;
}

export type AuthStoredState = {
  userId: ID | null;
  email: string | null;
  role: Role | null;
};

export type AuthContextState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type AuthContextValue = AuthContextState & {
  login: (email?: string, role?: Role) => Promise<void>;
  logout: () => Promise<void>;
};

export type BookFormat = 'hardcover' | 'paperback' | 'ebook' | 'audiobook';

export type BookStatus = 'available' | 'checked_out' | 'on_hold' | 'missing' | 'processing';

export interface Book {
  id: ID;
  title: string;
  subtitle?: string | null;
  author: string;
  isbn?: string | null;
  coverImageUrl?: string | null;
  description?: string | null;
  categories: string[];
  tags?: string[] | null;
  publicationYear?: number | null;
  publisher?: string | null;
  pages?: number | null;
  language?: string | null;
  format: BookFormat;
  status: BookStatus;
  location?: string | null;
  availableCopies: number;
  totalCopies: number;
  createdAt: string;
  updatedAt?: string | null;
}

export type CheckoutStatus = 'active' | 'returned' | 'overdue' | 'lost';

export interface Checkout {
  id: ID;
  userId: ID;
  bookId: ID;
  checkedOutAt: string;
  dueAt: string;
  returnedAt?: string | null;
  status: CheckoutStatus;
  renewedCount: number;
}

export type HoldStatus = 'active' | 'fulfilled' | 'cancelled' | 'expired';

export interface HoldRequest {
  id: ID;
  userId: ID;
  bookId: ID;
  status: HoldStatus;
  position: number;
  requestedAt: string;
  fulfilledAt?: string | null;
  cancelledAt?: string | null;
}

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type CatalogSortField = 'title' | 'author' | 'publicationYear' | 'createdAt';

export type SortDirection = 'asc' | 'desc';

export interface CatalogFilters {
  query: string;
  categories: string[];
  formats: BookFormat[];
  statuses: BookStatus[];
  years: number[];
}

export type CatalogQueryParams = {
  page: number;
  pageSize: number;
  sortField: CatalogSortField;
  sortDirection: SortDirection;
  filters: CatalogFilters;
};

const types = {};
export default types;
import { Book, BookStatus, Checkout, CheckoutStatus, HoldRequest, HoldStatus, ID, Role, User } from '@/types';

const now = new Date();
const daysFromNow = (days: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const mockUsers: User[] = [
  {
    id: 'u-admin',
    name: 'Alex Thompson',
    email: 'admin@conestoga.edu',
    role: 'admin' as Role,
    avatarUrl: null,
    createdAt: daysFromNow(-120),
    updatedAt: daysFromNow(-5),
    isActive: true,
  },
  {
    id: 'u-librarian',
    name: 'Morgan Lee',
    email: 'librarian@conestoga.edu',
    role: 'librarian' as Role,
    avatarUrl: null,
    createdAt: daysFromNow(-90),
    updatedAt: daysFromNow(-3),
    isActive: true,
  },
  {
    id: 'u-student-1',
    name: 'Priya Singh',
    email: 'psingh1@conestoga.edu',
    role: 'user' as Role,
    avatarUrl: null,
    createdAt: daysFromNow(-60),
    updatedAt: null,
    isActive: true,
  },
  {
    id: 'u-student-2',
    name: 'Daniel Kim',
    email: 'dkim2@conestoga.edu',
    role: 'user' as Role,
    avatarUrl: null,
    createdAt: daysFromNow(-45),
    updatedAt: null,
    isActive: true,
  },
];

export const mockBooks: Book[] = [
  {
    id: 'b-1',
    title: 'Modern Web Development with React',
    subtitle: 'Building Performant Interfaces',
    author: 'Emily Carter',
    isbn: '9781234567890',
    coverImageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    description:
      'A comprehensive guide to designing, building, and deploying modern web applications using React and TypeScript.',
    categories: ['Technology', 'Web Development'],
    tags: ['react', 'typescript', 'frontend'],
    publicationYear: 2022,
    publisher: 'Conestoga Press',
    pages: 432,
    language: 'English',
    format: 'hardcover',
    status: 'available',
    location: 'Stacks A3-14',
    availableCopies: 3,
    totalCopies: 4,
    createdAt: daysFromNow(-100),
    updatedAt: daysFromNow(-10),
  },
  {
    id: 'b-2',
    title: 'Data Structures & Algorithms Illustrated',
    subtitle: null,
    author: 'Liam Martinez',
    isbn: '9780987654321',
    coverImageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    description:
      'An approachable introduction to core data structures and algorithms with visual explanations and examples in JavaScript.',
    categories: ['Computer Science'],
    tags: ['algorithms', 'data structures'],
    publicationYear: 2020,
    publisher: 'Academic House',
    pages: 528,
    language: 'English',
    format: 'paperback',
    status: 'checked_out',
    location: 'Stacks C2-07',
    availableCopies: 0,
    totalCopies: 2,
    createdAt: daysFromNow(-200),
    updatedAt: daysFromNow(-30),
  },
  {
    id: 'b-3',
    title: 'Designing for Accessibility',
    subtitle: 'Inclusive Interfaces for Everyone',
    author: 'Sofia Rossi',
    isbn: '9781593279509',
    coverImageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    description:
      'Practical strategies, patterns, and guidelines for creating accessible digital experiences that work for all users.',
    categories: ['Design', 'Technology'],
    tags: ['accessibility', 'ux'],
    publicationYear: 2019,
    publisher: 'Inclusive Design Lab',
    pages: 310,
    language: 'English',
    format: 'ebook',
    status: 'on_hold',
    location: 'Digital Collection',
    availableCopies: 0,
    totalCopies: 1,
    createdAt: daysFromNow(-300),
    updatedAt: daysFromNow(-5),
  },
  {
    id: 'b-4',
    title: 'Foundations of Academic Writing',
    subtitle: null,
    author: 'Dr. Hannah Nguyen',
    isbn: '9780321992789',
    coverImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    description:
      'A step-by-step handbook for research writing, citation management, and academic integrity for college students.',
    categories: ['Writing', 'Study Skills'],
    tags: ['writing', 'research'],
    publicationYear: 2018,
    publisher: 'Campus Essentials',
    pages: 256,
    language: 'English',
    format: 'paperback',
    status: 'available',
    location: 'Stacks B1-02',
    availableCopies: 5,
    totalCopies: 5,
    createdAt: daysFromNow(-400),
    updatedAt: null,
  },
  {
    id: 'b-5',
    title: 'Machine Learning in Practice',
    subtitle: 'From Prototypes to Production',
    author: 'Noah Patel',
    isbn: '9781492032649',
    coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    description:
      'Real-world techniques for building, evaluating, and deploying machine learning models with reproducible workflows.',
    categories: ['Computer Science', 'Data Science'],
    tags: ['machine learning', 'ai'],
    publicationYear: 2021,
    publisher: 'DataWorks',
    pages: 612,
    language: 'English',
    format: 'hardcover',
    status: 'processing',
    location: 'Technical Services',
    availableCopies: 0,
    totalCopies: 3,
    createdAt: daysFromNow(-15),
    updatedAt: daysFromNow(-1),
  },
];

export const mockCheckouts: Checkout[] = [
  {
    id: 'c-1',
    userId: 'u-student-1',
    bookId: 'b-2',
    checkedOutAt: daysFromNow(-20),
    dueAt: daysFromNow(-5),
    returnedAt: null,
    status: 'overdue',
    renewedCount: 1,
  },
  {
    id: 'c-2',
    userId: 'u-student-2',
    bookId: 'b-1',
    checkedOutAt: daysFromNow(-10),
    dueAt: daysFromNow(10),
    returnedAt: null,
    status: 'active',
    renewedCount: 0,
  },
  {
    id: 'c-3',
    userId: 'u-student-1',
    bookId: 'b-4',
    checkedOutAt: daysFromNow(-60),
    dueAt: daysFromNow(-30),
    returnedAt: daysFromNow(-25),
    status: 'returned',
    renewedCount: 0,
  },
];

export const mockHoldRequests: HoldRequest[] = [
  {
    id: 'h-1',
    userId: 'u-student-2',
    bookId: 'b-3',
    status: 'active',
    position: 1,
    requestedAt: daysFromNow(-2),
    fulfilledAt: null,
    cancelledAt: null,
  },
  {
    id: 'h-2',
    userId: 'u-student-1',
    bookId: 'b-3',
    status: 'active',
    position: 2,
    requestedAt: daysFromNow(-1),
    fulfilledAt: null,
    cancelledAt: null,
  },
];

export function computeCheckoutStatus(checkout: Checkout): CheckoutStatus {
  const baseStatus: CheckoutStatus = checkout?.status ?? 'active';
  if (checkout?.returnedAt ?? null) {
    return 'returned';
  }
  const due = new Date(checkout?.dueAt ?? now.toISOString()).getTime();
  const nowTs = now.getTime();
  if (baseStatus === 'lost') return 'lost';
  if (nowTs > due) return 'overdue';
  return 'active';
}

export function isCheckoutOverdue(checkout: Checkout): boolean {
  return computeCheckoutStatus(checkout) === 'overdue';
}

export function computeBookStatus(bookId: ID, checkouts: Checkout[], holds: HoldRequest[]): BookStatus {
  const book = mockBooks.find((b) => b?.id === bookId);
  const baseStatus: BookStatus = book?.status ?? 'available';
  if (baseStatus === 'missing' || baseStatus === 'processing') return baseStatus;
  const activeCheckouts = checkouts.filter(
    (c) => c?.bookId === bookId && computeCheckoutStatus(c) !== 'returned'
  );
  if (activeCheckouts.length > 0) return 'checked_out';
  const activeHolds = holds.filter((h) => h?.bookId === bookId && h?.status === 'active');
  if (activeHolds.length > 0) return 'on_hold';
  return 'available';
}

export function getUserActiveCheckouts(userId: ID): Checkout[] {
  return mockCheckouts.filter((c) => c?.userId === userId && computeCheckoutStatus(c) !== 'returned');
}

export function getUserActiveHolds(userId: ID): HoldRequest[] {
  return mockHoldRequests.filter((h) => h?.userId === userId && h?.status === 'active');
}

export const mockData = {
  users: mockUsers,
  books: mockBooks,
  checkouts: mockCheckouts,
  holdRequests: mockHoldRequests,
  computeCheckoutStatus,
  isCheckoutOverdue,
  computeBookStatus,
  getUserActiveCheckouts,
  getUserActiveHolds,
};

export default mockData;
export const categories = (mockData as any)?.categories ?? [];

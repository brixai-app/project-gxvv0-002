import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X, BookOpen, Calendar, Users, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Book, Role } from '@/types';
import { useAuth, useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export interface BookDetailDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  book?: Book | null;
}

export function BookDetailDrawer({
  open = false,
  onOpenChange = () => {},
  book = null,
}: BookDetailDrawerProps) {
  const { user } = useAuth();
  const { checkoutBook, returnBook, placeHold } = useAppContext() as {
    checkoutBook?: (bookId: string) => Promise<void>;
    returnBook?: (bookId: string) => Promise<void>;
    placeHold?: (bookId: string) => Promise<void>;
  };

  const role: Role | null = user?.role ?? null;
  const isAuthenticated = !!user;
  const canBorrow = role === 'user' || role === 'librarian' || role === 'admin';
  const canManage = role === 'librarian' || role === 'admin';

  const status = book?.status ?? 'available';
  const isAvailable = status === 'available' && (book?.availableCopies ?? 0) > 0;
  const canCheckout = isAuthenticated && canBorrow && isAvailable;
  const canReturn = isAuthenticated && canManage && status === 'checked_out';
  const canHold = isAuthenticated && !isAvailable;

  const handleActionError = (reason: string) => {
    toast.error(reason);
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to manage books.');
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!book?.id) return;
    if (!requireAuth()) return;
    if (!canBorrow) {
      handleActionError('Your role is not permitted to check out books.');
      return;
    }
    if (!isAvailable) {
      handleActionError('This title is not currently available for checkout.');
      return;
    }
    if (!checkoutBook) {
      handleActionError('Checkout service is unavailable.');
      return;
    }
    try {
      await checkoutBook(book.id);
      toast.success('Book checked out successfully.');
    } catch {
      handleActionError('Failed to check out book. Please try again.');
    }
  };

  const handleReturn = async () => {
    if (!book?.id) return;
    if (!requireAuth()) return;
    if (!canManage) {
      handleActionError('Only librarians or admins can process returns.');
      return;
    }
    if (status !== 'checked_out') {
      handleActionError('This book is not currently checked out.');
      return;
    }
    if (!returnBook) {
      handleActionError('Return service is unavailable.');
      return;
    }
    try {
      await returnBook(book.id);
      toast.success('Book returned successfully.');
    } catch {
      handleActionError('Failed to process return. Please try again.');
    }
  };

  const handleHold = async () => {
    if (!book?.id) return;
    if (!requireAuth()) return;
    if (isAvailable) {
      handleActionError('This title is currently available. Please check it out instead.');
      return;
    }
    if (!placeHold) {
      handleActionError('Hold service is unavailable.');
      return;
    }
    try {
      await placeHold(book.id);
      toast.success('Hold placed successfully.');
    } catch {
      handleActionError('Failed to place hold. Please try again.');
    }
  };

  const statusLabelMap: Record<string, string> = {
    available: 'Available',
    checked_out: 'Checked Out',
    on_hold: 'On Hold',
    missing: 'Missing',
    processing: 'Processing',
  };

  if (!book) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal />
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl border-l border-[#B0B8C1] focus:outline-none">
          <motion.div
            initial={{ x: 64, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 64, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="flex h-full flex-col"
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
              <div className="space-y-1">
                <Dialog.Title className="font-['Playfair_Display'] text-2xl text-[#0B1220]">
                  {book.title ?? 'Untitled'}
                </Dialog.Title>
                {book.subtitle ? (
                  <p className="text-sm text-[#4B5563] line-clamp-1">{book.subtitle}</p>
                ) : null}
                <p className="text-xs uppercase tracking-[0.2em] text-[#4B5563]">
                  {book.author ?? 'Unknown Author'}
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="ml-4 rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <div className="flex gap-4">
                <div className="relative h-40 w-28 overflow-hidden rounded-[14px] bg-[#F6F8FB] border border-[#B0B8C1]/60 flex items-center justify-center">
                  {book.coverImageUrl ? (
                    <img
                      src={book.coverImageUrl ?? ''}
                      crossOrigin="anonymous"
                      alt={book.title ?? 'Book cover'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-8 w-8 text-[#B0B8C1]" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-md bg-[#F6F8FB] px-2.5 py-1.5 text-xs">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 font-medium',
                        status === 'available' ? 'text-emerald-700' : 'text-[#0B1220]'
                      )}
                    >
                      {status === 'available' ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5" />
                      )}
                      {statusLabelMap[status] ?? 'Unknown'}
                    </span>
                    <span className="h-3 w-px bg-[#B0B8C1]/60" />
                    <span className="text-[#4B5563]">
                      {book.availableCopies ?? 0} of {book.totalCopies ?? 0} available
                    </span>
                  </div>
                  {book.location ? (
                    <p className="text-xs text-[#4B5563]">
                      Shelf Location:{' '}
                      <span className="font-medium text-[#0B1220]">{book.location}</span>
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-2 text-xs text-[#4B5563]">
                    {book.publicationYear ? (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {book.publicationYear}
                      </span>
                    ) : null}
                    {book.publisher ? (
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {book.publisher}
                      </span>
                    ) : null}
                    {book.format ? (
                      <span className="inline-flex items-center gap-1">
                        <Info className="h-3.5 w-3.5" />
                        {book.format.toUpperCase()}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {book.description ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-[#0B1220] flex items-center gap-2">
                    Synopsis
                    <span className="h-px flex-1 bg-slate-200" />
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4B5563] whitespace-pre-line">
                    {book.description}
                  </p>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-4 text-xs text-[#4B5563]">
                {book.language ? (
                  <div>
                    <p className="uppercase tracking-[0.18em] text-[0.65rem] mb-1">Language</p>
                    <p className="text-sm text-[#0B1220]">{book.language}</p>
                  </div>
                ) : null}
                {book.pages ? (
                  <div>
                    <p className="uppercase tracking-[0.18em] text-[0.65rem] mb-1">Pages</p>
                    <p className="text-sm text-[#0B1220]">{book.pages}</p>
                  </div>
                ) : null}
                {book.isbn ? (
                  <div>
                    <p className="uppercase tracking-[0.18em] text-[0.65rem] mb-1">ISBN</p>
                    <p className="text-sm text-[#0B1220]">{book.isbn}</p>
                  </div>
                ) : null}
                {book.categories?.length ? (
                  <div>
                    <p className="uppercase tracking-[0.18em] text-[0.65rem] mb-1">Categories</p>
                    <p className="text-sm text-[#0B1220] line-clamp-2">
                      {book.categories.join(', ')}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4 space-y-2 bg-[#F6F8FB]">
              {!isAuthenticated ? (
                <p className="text-xs text-[#4B5563]">
                  Sign in to check out, return, or place a hold on this title.
                </p>
              ) : null}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleCheckout()}
                  disabled={!canCheckout}
                  className={cn(
                    'flex-1 rounded-md px-3 py-2 text-sm font-semibold tracking-[0.18em] uppercase transition-colors',
                    canCheckout
                      ? 'bg-[#003366] text-white hover:bg-[#0A3E7A]'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  )}
                >
                  Check Out
                </button>
                <button
                  type="button"
                  onClick={() => handleReturn()}
                  disabled={!canReturn}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-semibold tracking-[0.18em] uppercase border',
                    canReturn
                      ? 'border-[#003366] text-[#003366] hover:bg-[#003366]/5'
                      : 'border-slate-200 text-slate-500 cursor-not-allowed'
                  )}
                >
                  Return
                </button>
                <button
                  type="button"
                  onClick={() => handleHold()}
                  disabled={!canHold}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-semibold tracking-[0.18em] uppercase border',
                    canHold
                      ? 'border-[#003366] text-[#003366] hover:bg-[#003366]/5'
                      : 'border-slate-200 text-slate-500 cursor-not-allowed'
                  )}
                >
                  Hold
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default BookDetailDrawer;
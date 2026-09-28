import React, { useMemo, useState } from 'react';
import { Search, Filter, Circle as ChevronLeft, ChevronRight } from 'lucide-react';
import { Book, CatalogFilters, CatalogSortField, SortDirection } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { categories as mockCategories } from '@/data/mockData';
import { BookDetailDrawer } from '@/components/BookDetailDrawer';
import { cn } from '@/lib/utils';

export function Catalog() {
  const { books } = useAppContext();
  const [query, setQuery] = useState<string>('');
  const [sortField, setSortField] = useState<CatalogSortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const filters: CatalogFilters = useMemo(
    () => ({
      query,
      categories: selectedCategories,
      formats: selectedFormats as any,
      statuses: selectedStatuses as any,
      years: [],
    }),
    [query, selectedCategories, selectedFormats, selectedStatuses],
  );

  const filteredAndSorted = useMemo(() => {
    const q = filters.query.toLowerCase().trim();
    let items = (books ?? []).filter((b) => {
      const matchesQuery =
        !q ||
        b?.title?.toLowerCase()?.includes(q) ||
        b?.author?.toLowerCase()?.includes(q) ||
        b?.categories?.some((c) => c?.toLowerCase()?.includes(q));
      const matchesCategory =
        !filters.categories?.length ||
        b?.categories?.some((c) => filters.categories?.includes(c));
      const matchesFormat =
        !filters.formats?.length || filters.formats?.includes(b?.format);
      const matchesStatus =
        !filters.statuses?.length || filters.statuses?.includes(b?.status);
      return matchesQuery && matchesCategory && matchesFormat && matchesStatus;
    });
    items = items.sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1;
      const aVal = (a as any)?.[sortField] ?? '';
      const bVal = (b as any)?.[sortField] ?? '';
      if (aVal === bVal) return 0;
      return aVal > bVal ? dir : -1 * dir;
    });
    return items;
  }, [books, filters, sortField, sortDirection]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = useMemo(
    () =>
      filteredAndSorted.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [filteredAndSorted, currentPage, pageSize],
  );

  const handleCategoryToggle = (category: string) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev?.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSortChange = (field: CatalogSortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book ?? null);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <section className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(260px,2fr)]">
        <div className="relative overflow-hidden rounded-[14px] bg-[#003366] text-white">
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
              alt="Conestoga Library"
              crossOrigin="anonymous"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative flex h-full flex-col justify-between p-8 md:p-10">
            <div className="max-w-xl space-y-4">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-200">
                Conestoga Library
              </p>
              <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
                Quiet power for serious readers.
              </h1>
              <p className="max-w-md text-sm md:text-base text-slate-100/80">
                Browse an editorial-grade catalog with precision filters,
                instant search, and focused reading workflows—wherever you are.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const el = document?.getElementById('catalog-grid');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="mt-6 inline-flex items-center justify-center rounded-md border border-white/40 bg-white/5 px-5 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-white hover:bg-white/15 transition-colors"
            >
              Explore catalog
            </button>
          </div>
        </div>
        <div className="rounded-[14px] bg-[#F6F8FB] px-5 py-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => {
                  setPage(1);
                  setQuery(e.target.value ?? '');
                }}
                placeholder="Search by title, author, or subject…"
                className="w-full rounded-md border border-[#B0B8C1] bg-white py-2 pl-9 pr-3 text-sm text-[#0B1220] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#B0B8C1] bg-white text-slate-700 hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs">
              {(mockCategories ?? []).slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryToggle(cat)}
                  className={cn(
                    'rounded-sm border px-2.5 py-1 font-medium',
                    selectedCategories?.includes(cat)
                      ? 'border-[#003366] bg-[#003366] text-white'
                      : 'border-[#B0B8C1] bg-white text-[#4B5563] hover:bg-slate-50',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#4B5563]">
              <span className="uppercase tracking-[0.16em]">Sort</span>
              <button
                type="button"
                onClick={() => handleSortChange('title')}
                className={cn(
                  'px-1.5 py-0.5 rounded-sm',
                  sortField === 'title' ? 'text-[#003366] font-semibold' : '',
                )}
              >
                Title
              </button>
              <button
                type="button"
                onClick={() => handleSortChange('author')}
                className={cn(
                  'px-1.5 py-0.5 rounded-sm',
                  sortField === 'author' ? 'text-[#003366] font-semibold' : '',
                )}
              >
                Author
              </button>
              <button
                type="button"
                onClick={() => handleSortChange('publicationYear')}
                className={cn(
                  'px-1.5 py-0.5 rounded-sm',
                  sortField === 'publicationYear'
                    ? 'text-[#003366] font-semibold'
                    : '',
                )}
              >
                Year
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog-grid" className="space-y-4">
        <div className="flex items-center justify-between gap-3 text-xs text-[#4B5563]">
          <p>
            Showing{' '}
            <span className="font-semibold text-[#0B1220]">
              {paginatedItems.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[#0B1220]">
              {totalItems}
            </span>{' '}
            titles
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#B0B8C1] bg-white text-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs">
              Page{' '}
              <span className="font-semibold text-[#0B1220]">
                {currentPage}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-[#0B1220]">
                {totalPages}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#B0B8C1] bg-white text-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedItems.map((book) => (
            <button
              type="button"
              key={book?.id}
              onClick={() => handleBookClick(book)}
              className="group flex flex-col overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-white text-left"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                <img
                  src={
                    book?.coverImageUrl ??
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={book?.title ?? 'Book cover'}
                  crossOrigin="anonymous"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 px-3.5 py-3">
                <p className="line-clamp-2 font-medium text-sm text-[#0B1220]">
                  {book?.title}
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#4B5563]">
                  {book?.author}
                </p>
                <p className="mt-1 text-[11px] text-[#4B5563]">
                  {book?.publicationYear ?? '—'} · {book?.format}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={cn(
                      'rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]',
                      book?.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700'
                        : book?.status === 'checked_out'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-700',
                    )}
                  >
                    {book?.status?.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-[#4B5563]">
                    {book?.availableCopies ?? 0}/{book?.totalCopies ?? 0}{' '}
                    available
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <BookDetailDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) setSelectedBook(null);
        }}
        book={selectedBook}
      />
    </div>
  );
}

export default Catalog;
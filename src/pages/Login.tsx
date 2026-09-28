import React, { FormEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AppContext';
import { Role } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LocationState {
  from?: { pathname?: string };
}

export function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location?.state as LocationState | null)?.from?.pathname ?? '/catalog';

  const [email, setEmail] = useState<string>('user@example.com');
  const [role, setRole] = useState<Role>('user');
  const [submitting, setSubmitting] = useState<boolean>(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || isLoading) return;
    setSubmitting(true);
    try {
      await login(email ?? '', role ?? 'user');
      toast.success('Signed in successfully');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=85"
          crossOrigin="anonymous"
          alt="Library shelves"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#003366]/60" />
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-white/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase">Conestoga Library</p>
              <p className="text-sm text-white/70">Remote Access Console</p>
            </div>
          </div>
          <div className="max-w-xl">
            <h1 className="font-['Playfair_Display'] text-5xl xl:text-6xl tracking-tight mb-6">
              Curate your academic world from anywhere.
            </h1>
            <p className="text-sm leading-relaxed text-white/80">
              Role-aware access for students, librarians, and administrators to search, manage, and
              monitor the full Conestoga catalog with precision.
            </p>
          </div>
          <p className="text-xs text-white/60">
            Optimized for secure remote sessions · Activity logging enabled
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white rounded-[14px] shadow-sm border border-[#B0B8C1]/40 p-8">
          <div className="mb-8">
            <p className="text-xs tracking-[0.25em] uppercase text-[#4B5563] mb-3">
              Sign in to continue
            </p>
            <h2 className="font-['Playfair_Display'] text-3xl tracking-tight text-[#0B1220] mb-2">
              Conestoga Library Console
            </h2>
            <p className="text-sm text-[#4B5563]">
              Choose a role to explore the role-based workflows. This mock sign-in persists your
              session in local storage.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium tracking-wide text-[#0B1220]">
                Email address
              </label>
              <input
                type="email"
                required
                value={email ?? ''}
                onChange={(e) => setEmail(e?.target?.value ?? '')}
                className="w-full rounded-md border border-[#B0B8C1] px-3 py-2 text-sm text-[#0B1220] font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] bg-white"
                placeholder="you@conestoga.edu"
              />
              <p className="text-[11px] text-[#4B5563]">
                Use any email format. This is a mock environment; passwords are not required.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium tracking-wide text-[#0B1220]">
                Sign in as
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['user', 'librarian', 'admin'] as Role[]).map((option) => {
                  const isActive = role === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRole(option)}
                      className={cn(
                        'border text-xs py-2 rounded-md font-medium tracking-wide uppercase',
                        'transition-colors',
                        isActive
                          ? 'bg-[#003366] text-white border-[#003366]'
                          : 'bg-white text-[#0B1220] border-[#B0B8C1] hover:border-[#003366]'
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#4B5563]">
                Admin: full control · Librarian: catalog + circulation · User: catalog-only view.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || isLoading}
              className={cn(
                'w-full inline-flex items-center justify-center gap-2 rounded-md',
                'bg-[#003366] hover:bg-[#0A3E7A] text-white text-sm font-medium',
                'py-2.5 px-4 transition-colors',
                (submitting || isLoading) && 'opacity-80 cursor-not-allowed'
              )}
            >
              <span>{submitting || isLoading ? 'Signing you in...' : 'Enter library console'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-[11px] text-[#4B5563] leading-relaxed">
              By continuing, you acknowledge that this is a demonstration workspace. Activity,
              roles, and preferences are stored locally in your browser.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
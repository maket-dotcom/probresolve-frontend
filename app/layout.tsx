import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/login/actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProbResolve — Consumer Complaint Board for India",
  description: "A consumer complaint board for India. Post and browse fraud complaints across banking, e-commerce, real estate, and more.",
  openGraph: {
    images: [{ url: "/stacked_logo.jpg" }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="bg-dark-bg text-dark-pop min-h-screen flex flex-col">
        {/* Nav — solid bg, no blur */}
        <nav className="bg-dark-s1 border-b border-dark-border sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image src="/icon_logo.svg" alt="ProbResolve" width={28} height={28} className="h-7 w-7" unoptimized />
              <span className="text-base font-semibold tracking-tight text-dark-pop">
                Prob<span className="text-brand-teal">Resolve</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Search — desktop only */}
              <form action="/search" method="get" className="hidden md:flex">
                <input
                  name="q"
                  type="search"
                  placeholder="Search complaints…"
                  className="bg-dark-s0 border border-dark-border text-dark-pop placeholder:text-dark-muted rounded-l-md px-3 py-2 text-sm focus:outline-none focus:border-brand-teal w-48"
                />
                <button
                  type="submit"
                  className="bg-dark-s2 text-dark-muted px-3 py-2 text-sm font-medium rounded-r-md border border-l-0 border-dark-border hover:bg-dark-s-hover hover:text-dark-pop transition-colors"
                >
                  Search
                </button>
              </form>

              <Link
                href="/"
                className="text-dark-muted hover:text-dark-pop text-sm font-medium transition-colors hidden sm:block"
              >
                Complaints
              </Link>

              <Link
                href="/scoreboard"
                className="text-dark-muted hover:text-dark-pop text-sm font-medium transition-colors hidden sm:block"
              >
                Scoreboard
              </Link>
              
              {user ? (
                <div className="flex items-center gap-3">
                 <Link
                   href="/dashboard"
                   className="text-dark-muted hover:text-dark-pop text-sm font-medium transition-colors hidden sm:block"
                 >
                   My Dashboard
                 </Link>
                 <form action={logout}>
                   <button className="text-dark-muted hover:text-dark-pop text-sm font-medium transition-colors hidden sm:block pt-0.5">
                     Logout
                   </button>
                 </form>
                </div>
              ) : (
                <Link
                   href="/login"
                   className="text-dark-muted hover:text-dark-pop text-sm font-medium transition-colors hidden sm:block"
                 >
                   Sign In
                 </Link>
              )}

              <Link
                href="/problems/new"
                className="bg-brand-teal hover:bg-brand-teal-h text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              >
                + Post Complaint
              </Link>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 max-w-5xl mx-auto px-4 py-8 pb-14 sm:pb-8 w-full">
          {children}
        </main>

        {/* Footer — minimal single line */}
        <footer className="border-t border-dark-border mt-16 py-6">
          <p className="text-center text-xs text-dark-muted">
            &copy; {new Date().getFullYear()} ProbResolve &mdash; Consumer Complaint Board for India
          </p>
        </footer>

        {/* Mobile bottom navigation — hidden on sm+ */}
        <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-dark-s1 border-t border-dark-border flex z-20">
          <Link
            href="/"
            className="flex-1 flex flex-col items-center py-2.5 gap-0.5 text-dark-muted hover:text-dark-pop transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 22V12h6v10" />
            </svg>
            <span className="text-[10px]">Feed</span>
          </Link>
          <Link
            href="/search"
            className="flex-1 flex flex-col items-center py-2.5 gap-0.5 text-dark-muted hover:text-dark-pop transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <span className="text-[10px]">Search</span>
          </Link>
          <Link
            href="/scoreboard"
            className="flex-1 flex flex-col items-center py-2.5 gap-0.5 text-dark-muted hover:text-dark-pop transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3v18h18" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16l4-4 4 4 4-5" />
            </svg>
            <span className="text-[10px]">Scoreboard</span>
          </Link>
          <Link
            href="/problems/new"
            className="flex-1 flex flex-col items-center py-2.5 gap-0.5 text-brand-teal hover:text-brand-teal-h transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[10px]">Post</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}

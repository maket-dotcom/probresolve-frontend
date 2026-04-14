import { Suspense } from "react";
import Link from "next/link";
import ProblemCard from "@/components/ProblemCard";
import DomainTabs from "@/components/DomainTabs";
import { getDomains, getProblems } from "@/lib/api";

export const metadata = {
  title: "ProbResolve — Consumer Complaints India",
};

type SearchParams = Promise<{ domain_id?: string; page?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { domain_id, page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const [domains, problems] = await Promise.all([
    getDomains(),
    getProblems(page, domain_id),
  ]);

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = problems.length === 20 ? page + 1 : null;

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (domain_id) params.set("domain_id", domain_id);
    params.set("page", String(p));
    return `/?${params.toString()}`;
  }

  return (
    <>
      {/* Hero section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-dark-pop mb-2">Consumer Complaint Board</h1>
        <p className="text-dark-muted text-sm mb-6">
          Browse fraud reports from across India. Upvote to amplify. Hold companies accountable.
        </p>
        <form action="/search" method="get" className="flex max-w-xl mb-4">
          <input
            name="q"
            type="search"
            placeholder="Search company names, fraud types…"
            className="flex-1 bg-dark-s0 border border-dark-border rounded-l-md px-4 py-3 text-sm text-dark-pop placeholder:text-dark-muted focus:outline-none focus:border-brand-teal"
          />
          <button
            type="submit"
            className="bg-brand-teal hover:bg-brand-teal-h text-white px-5 py-3 text-sm font-medium rounded-r-md transition-colors"
          >
            Search
          </button>
        </form>
        <Link
          href="/scoreboard"
          className="text-brand-teal hover:text-brand-teal-h text-sm font-medium transition-colors"
        >
          View Scoreboard →
        </Link>
      </div>

      {/* Domain filter tabs */}
      <Suspense fallback={null}>
        <DomainTabs domains={domains} activeDomainId={domain_id} />
      </Suspense>

      {/* Problem list */}
      <div className="space-y-4">
        {problems.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-dark-s1 border border-dark-border flex items-center justify-center text-3xl">
              📭
            </div>
            <p className="text-dark-pop font-semibold text-sm">No complaints yet</p>
            <p className="text-dark-muted text-xs max-w-xs leading-relaxed">
              Be the first to document a fraud or consumer experience in this category.
            </p>
            <Link
              href="/problems/new"
              className="mt-1 bg-brand-teal hover:bg-brand-teal-h text-white text-sm px-5 py-2 rounded-full font-semibold transition-colors"
            >
              + Post a Complaint
            </Link>
          </div>
        ) : (
          problems.map((p) => <ProblemCard key={p.id} problem={p} />)
        )}
      </div>

      {/* Pagination */}
      {(prevPage || nextPage) && (
        <div className="mt-8 flex justify-center gap-3">
          {prevPage && (
            <Link
              href={pageUrl(prevPage)}
              className="bg-dark-s1 border border-dark-border text-dark-pop px-5 py-2 rounded-lg hover:bg-dark-s2 text-sm transition-colors"
            >
              ← Previous
            </Link>
          )}
          {nextPage && (
            <Link
              href={pageUrl(nextPage)}
              className="bg-dark-s1 border border-dark-border text-dark-pop px-5 py-2 rounded-lg hover:bg-dark-s2 text-sm transition-colors"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}

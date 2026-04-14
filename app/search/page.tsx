import { Suspense } from "react";
import Link from "next/link";
import ProblemCard from "@/components/ProblemCard";
import DomainTabs from "@/components/DomainTabs";
import { getDomains, searchProblems } from "@/lib/api";

type SearchParams = Promise<{ q?: string; page?: string; domain_id?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  return { title: q ? `"${q}" — ProbResolve Search` : "Search — ProbResolve" };
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = "", page: pageStr, domain_id } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const [domains, problems] = await Promise.all([
    getDomains(),
    q.trim() ? searchProblems(q.trim(), page, domain_id) : Promise.resolve([]),
  ]);

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = problems.length === 20 ? page + 1 : null;

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (domain_id) params.set("domain_id", domain_id);
    params.set("page", String(p));
    return `/search?${params.toString()}`;
  }

  return (
    <>
      {/* Search bar */}
      <form action="/search" method="get" className="mb-6 flex max-w-xl">
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search complaints…"
          autoFocus
          className="flex-1 bg-dark-s0 border border-dark-border text-dark-pop placeholder:text-dark-muted rounded-l-md px-3 py-2 text-sm focus:outline-none focus:border-brand-teal"
        />
        {domain_id && <input type="hidden" name="domain_id" value={domain_id} />}
        <button
          type="submit"
          className="bg-brand-teal hover:bg-brand-teal-h text-white px-4 py-2 text-sm font-medium rounded-r-md transition-colors"
        >
          Search
        </button>
      </form>

      {/* Domain filter tabs */}
      <Suspense fallback={null}>
        <DomainTabs domains={domains} activeDomainId={domain_id} basePath="/search" />
      </Suspense>

      {q.trim() ? (
        <>
          <h1 className="text-lg font-semibold text-dark-pop mb-4">
            {problems.length === 0
              ? `No results for "${q}"`
              : `Results for "${q}"`}
          </h1>

          <div className="space-y-4">
            {problems.map((p) => (
              <ProblemCard key={p.id} problem={p} />
            ))}
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
      ) : (
        <p className="text-dark-muted text-sm text-center py-12">
          Enter a search term above to find complaints.
        </p>
      )}

      <div className="mt-6">
        <Link href="/" className="text-sm text-dark-muted hover:text-dark-pop transition-colors">
          ← Back to all complaints
        </Link>
      </div>
    </>
  );
}

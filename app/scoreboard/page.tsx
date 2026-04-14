import { Suspense } from "react";
import Link from "next/link";
import DomainTabs from "@/components/DomainTabs";
import CompanyScoreCard from "@/components/CompanyScoreCard";
import { getDomains, getScoreboard } from "@/lib/api";
import { formatIndianRupees } from "@/lib/formatting";

export const metadata = {
  title: "Company Scoreboard — ProbResolve",
  description: "See which companies have the most consumer complaints and total losses reported on ProbResolve.",
};

type SearchParams = Promise<{ domain_id?: string; sort?: string }>;

export default async function ScoreboardPage({ searchParams }: { searchParams: SearchParams }) {
  const { domain_id, sort = "complaints" } = await searchParams;
  const validSort = sort === "amount" ? "amount" : "complaints";

  const [domains, companies] = await Promise.all([
    getDomains(),
    getScoreboard(domain_id, validSort as "complaints" | "amount"),
  ]);

  const totalComplaints = companies.reduce((s, c) => s + c.complaint_count, 0);
  const totalLost = companies.reduce((s, c) => s + c.total_amount_lost, 0);

  function sortUrl(newSort: string) {
    const params = new URLSearchParams();
    if (domain_id) params.set("domain_id", domain_id);
    params.set("sort", newSort);
    return `/scoreboard?${params.toString()}`;
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-dark-pop mb-2">Company Scoreboard</h1>
        <p className="text-dark-muted text-sm mb-4">
          Companies ranked by consumer complaints. Hold them accountable.
        </p>

        {/* Aggregate stats */}
        {companies.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
            <div>
              <p className="text-dark-muted text-xs">Companies tracked</p>
              <p className="text-dark-pop font-bold text-lg leading-none mt-0.5">{companies.length}</p>
            </div>
            <div>
              <p className="text-dark-muted text-xs">Total complaints</p>
              <p className="text-brand-orange font-bold text-lg leading-none mt-0.5">{totalComplaints}</p>
            </div>
            {totalLost > 0 && (
              <div>
                <p className="text-dark-muted text-xs">₹ Total reported</p>
                <p className="text-brand-green font-bold text-lg leading-none mt-0.5">
                  {formatIndianRupees(totalLost)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sort toggle */}
        <div className="flex gap-2 text-sm">
          <Link
            href={sortUrl("complaints")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              validSort === "complaints"
                ? "bg-brand-teal text-white"
                : "border border-dark-border text-dark-muted hover:bg-dark-s2 hover:text-dark-pop"
            }`}
          >
            {validSort === "complaints" ? "↓ " : ""}By Complaints
          </Link>
          <Link
            href={sortUrl("amount")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              validSort === "amount"
                ? "bg-brand-teal text-white"
                : "border border-dark-border text-dark-muted hover:bg-dark-s2 hover:text-dark-pop"
            }`}
          >
            {validSort === "amount" ? "↓ " : ""}By ₹ Lost
          </Link>
        </div>
      </div>

      {/* Domain filter */}
      <Suspense fallback={null}>
        <DomainTabs domains={domains} activeDomainId={domain_id} basePath="/scoreboard" />
      </Suspense>

      {/* Grid */}
      {companies.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-dark-s1 border border-dark-border flex items-center justify-center text-3xl">
            🏢
          </div>
          <p className="text-dark-pop font-semibold text-sm">No companies found</p>
          <p className="text-dark-muted text-xs max-w-xs leading-relaxed">
            No complaints have been filed in this category yet. Try a different filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c, i) => (
            <CompanyScoreCard key={c.id} company={c} rank={i + 1} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/" className="text-sm text-dark-muted hover:text-dark-pop transition-colors">
          ← Back to complaints
        </Link>
      </div>
    </>
  );
}

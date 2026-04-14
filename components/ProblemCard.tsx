import Link from "next/link";
import type { ProblemListItem } from "@/lib/types";
import { formatDate, formatIndianRupees } from "@/lib/formatting";

export default function ProblemCard({ problem }: { problem: ProblemListItem }) {
  const underReview =
    problem.report_count >= 5 && !problem.flags_cleared && !problem.is_verified;

  return (
    <Link
      href={`/problems/${problem.id}/${problem.slug}`}
      className="group bg-dark-s1 flex items-center gap-4 border border-dark-border rounded-lg p-4 hover:border-brand-teal transition-colors cursor-pointer"
    >
      {/* Upvote count — compact column */}
      <div className="flex-shrink-0 flex flex-col items-center min-w-[48px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-brand-teal"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
        <span className="text-sm font-bold text-brand-teal leading-none mt-0.5">
          {problem.upvote_count}
        </span>
      </div>

      {/* Content — title + metadata */}
      <div className="flex-1 min-w-0">
        <span className="text-base font-semibold text-dark-pop group-hover:text-brand-teal group-hover:underline underline-offset-2 line-clamp-2 transition-colors leading-snug">
          {problem.title}
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="bg-brand-teal/15 text-brand-teal px-2 py-0.5 rounded-lg font-medium">
            {problem.domain.icon} {problem.domain.name}
          </span>
          {problem.company && (
            <span className="bg-dark-s-hover text-dark-pop px-2 py-0.5 rounded-lg border border-dark-border">
              🏢 {problem.company.name}
            </span>
          )}
          {problem.category && (
            <span className="text-dark-muted px-2 py-0.5 rounded-lg bg-dark-s-hover">
              {problem.category.name}
            </span>
          )}
          {problem.location_state && (
            <span className="text-dark-muted hidden sm:inline">📍 {problem.location_state}</span>
          )}
          {problem.amount_lost != null && (
            <span className="text-brand-orange font-medium">💸 {formatIndianRupees(problem.amount_lost)}</span>
          )}
          <span className="text-dark-tertiary">{formatDate(problem.created_at)}</span>
          {problem.is_verified && (
            <span className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded-lg font-medium">
              ✅ Verified
            </span>
          )}
          {underReview && (
            <span className="bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded-lg font-medium">
              ⚠️ Under Review
            </span>
          )}
          {problem.is_resolved && (
            <span className="text-brand-teal font-medium">✓ Resolved</span>
          )}
        </div>
      </div>

      {/* Right chevron */}
      <div className="flex-shrink-0 text-dark-tertiary group-hover:text-dark-muted transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

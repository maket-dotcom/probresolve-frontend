"use client";

import { useState, useTransition } from "react";
import type { CompanyScoreEntry, CategoryScore } from "@/lib/types";
import { formatIndianRupees } from "@/lib/formatting";
import { fetchCategoryBreakdown } from "@/app/scoreboard/actions";
import CategoryBreakdown from "./CategoryBreakdown";

const rankAccent = (rank: number) =>
  rank === 1 ? "border-t-2 border-t-yellow-500/70" :
  rank === 2 ? "border-t-2 border-t-slate-400/60" :
  rank === 3 ? "border-t-2 border-t-orange-600/60" : "";

const rankColor = (rank: number) =>
  rank === 1 ? "text-yellow-400 font-semibold" :
  rank === 2 ? "text-slate-400 font-semibold" :
  rank === 3 ? "text-orange-400 font-semibold" : "text-dark-muted font-mono";

export default function CompanyScoreCard({
  company,
  rank,
}: {
  company: CompanyScoreEntry;
  rank: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState<CategoryScore[] | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    if (!expanded && categories === null) {
      startTransition(async () => {
        const data = await fetchCategoryBreakdown(company.id);
        setCategories(data);
      });
    }
    setExpanded((prev) => !prev);
  }

  return (
    <div className={`bg-dark-s2 border border-dark-border rounded-xl min-h-[180px] flex flex-col hover:bg-dark-s-hover hover:-translate-y-px hover:shadow-md hover:shadow-black/8 transition-all relative ${rankAccent(rank)}`}>
      {/* Main card body */}
      <div className="p-4 flex flex-col gap-3">
        {/* Rank badge — absolute top-right */}
        <span className={`absolute top-3 right-3 text-xs ${rankColor(rank)}`}>
          #{rank}
        </span>

        {/* Domain pill */}
        {company.domain && (
          <span className="bg-dark-s0 text-dark-muted text-xs px-2 py-0.5 rounded-lg truncate mr-6">
            {company.domain.icon} {company.domain.name}
          </span>
        )}

        {/* Company name */}
        <h3 className="text-dark-pop font-semibold text-sm line-clamp-2 leading-snug">
          {company.name}
        </h3>

        {/* Stats */}
        <div className="border-t border-dark-border pt-3 grid grid-cols-2 gap-2 mt-auto">
          <div>
            <p className="text-dark-muted text-xs">Complaints</p>
            <p className="text-brand-orange font-bold text-lg leading-none mt-0.5">
              {company.complaint_count}
            </p>
          </div>
          <div>
            <p className="text-dark-muted text-xs">₹ Lost</p>
            <p className="text-brand-green font-bold text-lg leading-none mt-0.5">
              {company.total_amount_lost > 0
                ? formatIndianRupees(company.total_amount_lost)
                : "—"}
            </p>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={handleToggle}
          className="flex items-center gap-1 text-[11px] text-dark-muted hover:text-dark-pop transition-colors mt-1 self-start"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {expanded ? "Hide breakdown" : "View breakdown"}
        </button>
      </div>

      {/* Expandable breakdown panel */}
      {expanded && (
        <CategoryBreakdown categories={categories ?? []} loading={isPending} />
      )}
    </div>
  );
}

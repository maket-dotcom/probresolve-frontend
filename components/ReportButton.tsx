"use client";

import { useState } from "react";

const REASONS = [
  { value: "fake", label: "Fake complaint" },
  { value: "defamatory", label: "Defamatory content" },
  { value: "duplicate", label: "Duplicate post" },
  { value: "other", label: "Other" },
];

export default function ReportButton({
  problemId,
  alreadyReported,
}: {
  problemId: string;
  alreadyReported: boolean;
}) {
  const [reported, setReported] = useState(alreadyReported);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("fake");
  const [loading, setLoading] = useState(false);

  async function handleReport() {
    if (loading) return;
    setLoading(true);
    try {
      const body = new URLSearchParams({ reason });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/problems/${problemId}/report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        }
      );
      if (res.ok) {
        setReported(true);
        setShowForm(false);
      }
    } finally {
      setLoading(false);
    }
  }

  if (reported) {
    return (
      <span className="text-sm text-dark-muted cursor-default">🚩 Reported</span>
    );
  }

  if (showForm) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="bg-dark-s0 border border-dark-border text-dark-pop rounded-md px-2 py-1 text-sm focus:outline-none focus:border-brand-teal"
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleReport}
          disabled={loading}
          className="bg-brand-teal text-white px-3 py-1 rounded-md text-sm hover:bg-brand-teal-h disabled:opacity-50 transition-colors"
        >
          {loading ? "Submitting…" : "Submit"}
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="text-dark-muted hover:text-dark-pop text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="text-sm text-dark-muted hover:text-brand-orange transition-colors"
    >
      🚩 Report
    </button>
  );
}

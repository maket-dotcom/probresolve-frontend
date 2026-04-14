"use client";

import { useState } from "react";

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-xs text-dark-muted hover:text-dark-pop border border-dark-border rounded-lg px-2.5 py-1 transition-colors"
    >
      {copied ? "✓ Copied!" : "Share"}
    </button>
  );
}

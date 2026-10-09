import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface DropScoreBadgeProps {
  score: number;
  label?: string;
  compact?: boolean;
}

export const DropScoreBadge: React.FC<DropScoreBadgeProps> = ({
  score,
  label = 'Verified Supplier',
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs leading-4 text-[#485B52]">
        <span className="font-mono-num font-semibold text-[#059669]">
          {score.toFixed(1)}/10
        </span>
        <span className="text-[#A7C4B5]" aria-hidden="true">·</span>
        <span>DropScore</span>
      </div>
    );
  }

  // Clean unboxed editorial trust line (Zero-Pill Discipline)
  return (
    <div className="py-2.5 px-3 rounded-xl bg-[#F2F9F5] border border-[#CBE4D6] flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
        <div className="text-xs leading-4 text-[#485B52] truncate">
          <span className="font-semibold text-[#0F1D17]">DropScore {score.toFixed(1)}/10</span>
          <span className="mx-1.5 text-[#A7C4B5]" aria-hidden="true">·</span>
          <span>{label}</span>
        </div>
      </div>
      <span className="text-[11px] leading-4 text-[#065F46] font-semibold shrink-0">
        Customs Pre-Cleared
      </span>
    </div>
  );
};

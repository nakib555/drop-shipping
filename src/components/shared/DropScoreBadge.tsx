import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface DropScoreBadgeProps {
  score: number;
  label?: string;
  compact?: boolean;
}

export const DropScoreBadge: React.FC<DropScoreBadgeProps> = ({
  score,
  label = 'Great Choice',
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 text-xs leading-4 font-semibold text-[#0B3D2E]">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0EA75F] text-white font-mono-num text-[10px] leading-3 font-bold">
          {score.toFixed(1)}
        </span>
        <span className="text-[#0EA75F] font-semibold">DropScore</span>
      </div>
    );
  }

  // 8pt Grid: p-3 (12px), gap-3 (12px), w-10 h-10 (40px) score circle
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#ECFDF5] border border-[#0EA75F]/20 gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#0EA75F] text-white flex items-center justify-center font-mono-num font-bold text-xs leading-4 shadow-sm shrink-0">
          {score.toFixed(1)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs leading-4 font-bold text-[#0B3D2E]">DropScore™</span>
            <span className="font-mono-num text-xs leading-4 font-extrabold text-[#0EA75F]">
              {score.toFixed(1)}/10
            </span>
          </div>
          <p className="text-[11px] leading-4 text-[#6B7280] mt-0.5">
            Landed Price · Delivery · Verified Supplier
          </p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg bg-[#0EA75F] text-white text-[11px] leading-4 font-semibold whitespace-nowrap shrink-0">
        <ShieldCheck className="w-3.5 h-3.5" />
        {label}
      </span>
    </div>
  );
};

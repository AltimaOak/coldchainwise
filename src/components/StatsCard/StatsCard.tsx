import React from 'react';
import type { ReactNode } from 'react';

interface StatsCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ value, label, description, icon }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-card p-5 flex flex-col gap-2 text-left shadow-md hover:shadow-lg transition-shadow">
      {icon && (
        <div className="text-primary-brand mb-2">
          {icon}
        </div>
      )}
      <span className="text-3xl font-extrabold text-primary tracking-tight">
        {value}
      </span>
      <span className="text-xs font-bold text-slate-800 tracking-tight">
        {label}
      </span>
      {description && (
        <span className="text-[11px] text-slate-500 leading-relaxed mt-1">
          {description}
        </span>
      )}
    </div>
  );
};

export default StatsCard;

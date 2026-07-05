import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullPage = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-t-accent border-slate-200 ${sizeClasses[size]} ${className}`} />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-app-bg z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading Cold Chain Wise...</span>
        </div>
      </div>
    );
  }

  return spinner;
};

interface SkeletonProps {
  className?: string;
}

export const SkeletonLine: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const SkeletonCard: React.FC = () => (
  <div className="p-5 border border-slate-200 rounded-card bg-white flex flex-col gap-3 enterprise-shadow">
    <SkeletonLine className="h-4 w-1/3" />
    <SkeletonLine className="h-8 w-2/3" />
    <SkeletonLine className="h-4 w-full" />
    <div className="flex justify-between items-center mt-2">
      <SkeletonLine className="h-6 w-1/4" />
      <SkeletonLine className="h-6 w-1/4" />
    </div>
  </div>
);

export const SkeletonTable: React.FC = () => (
  <div className="w-full flex flex-col gap-3">
    <div className="flex gap-4 p-3 bg-slate-100 rounded-md">
      <SkeletonLine className="h-4 w-1/6" />
      <SkeletonLine className="h-4 w-2/6" />
      <SkeletonLine className="h-4 w-1/6" />
      <SkeletonLine className="h-4 w-1/6" />
      <SkeletonLine className="h-4 w-1/6" />
    </div>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex gap-4 p-3 border-b border-slate-100">
        <SkeletonLine className="h-4 w-1/6" />
        <SkeletonLine className="h-4 w-2/6" />
        <SkeletonLine className="h-4 w-1/6" />
        <SkeletonLine className="h-4 w-1/6" />
        <SkeletonLine className="h-4 w-1/6" />
      </div>
    ))}
  </div>
);

export default LoadingSpinner;

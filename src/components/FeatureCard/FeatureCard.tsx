import React from 'react';
import type { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-card p-6 enterprise-shadow hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col gap-4 group">
      <div className="p-2.5 bg-slate-50 text-accent rounded-md w-fit group-hover:bg-accent group-hover:text-white transition-colors duration-200">
        {icon}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;

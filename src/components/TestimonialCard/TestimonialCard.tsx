import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  company
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-card p-6 flex flex-col justify-between gap-6 shadow-sm hover:border-slate-300 transition-all duration-200">
      <div className="flex flex-col gap-4">
        <FiMessageSquare className="text-accent/30 w-6 h-6" />
        <p className="text-xs font-medium italic leading-relaxed text-slate-700">
          "{quote}"
        </p>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs select-none">
          {getInitials(author)}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-primary">{author}</span>
          <span className="text-[10px] text-slate-500 font-medium">{role}, {company}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;

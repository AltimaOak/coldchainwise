import React from 'react';
import Button from '../Button/Button';
import { FiCheck } from 'react-icons/fi';

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
  onSelect?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period = '/mo',
  description,
  features,
  isPopular = false,
  buttonText = 'Choose Plan',
  onSelect
}) => {
  return (
    <div className={`
      relative bg-white border rounded-card p-6 flex flex-col justify-between shadow-sm transition-all duration-200 hover:shadow-md
      ${isPopular ? 'border-accent ring-1 ring-accent' : 'border-slate-200'}
    `}>
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[9px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
          Most Popular
        </span>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">{name}</h3>
          <p className="text-[11px] text-slate-500">{description}</p>
        </div>

        <div className="flex items-baseline">
          <span className="text-3xl font-extrabold text-primary tracking-tight">{price}</span>
          {price !== 'Custom' && <span className="text-xs text-slate-500 ml-1">{period}</span>}
        </div>

        <div className="border-t border-slate-100 my-2 pt-4">
          <ul className="flex flex-col gap-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                <FiCheck className="text-success w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-50">
        <Button 
          variant={isPopular ? 'primary' : 'outline'} 
          className="w-full text-xs font-semibold"
          onClick={onSelect}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;

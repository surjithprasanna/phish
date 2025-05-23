import React from 'react';
import { Check, Target, Radar, Star, AlertCircle, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  format: 'percent' | 'number';
  icon: 'check' | 'bullseye' | 'radar' | 'star' | 'alert' | 'trend';
  color: 'green' | 'blue' | 'indigo' | 'purple' | 'red' | 'amber';
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  description, 
  format,
  icon,
  color
}) => {
  // Format the value based on the format prop
  const formattedValue = format === 'percent' 
    ? `${Math.round(value * 100)}%` 
    : value.toLocaleString();
  
  // Map colors to Tailwind classes
  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    green: { bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', iconBg: 'bg-indigo-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100' },
    red: { bg: 'bg-red-50', text: 'text-red-700', iconBg: 'bg-red-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', iconBg: 'bg-amber-100' }
  };
  
  const colorClasses = colorMap[color] || colorMap.blue;
  
  // Map icon names to Lucide components
  const getIcon = () => {
    switch (icon) {
      case 'check':
        return <Check className="h-5 w-5" />;
      case 'bullseye':
        return <Target className="h-5 w-5" />;
      case 'radar':
        return <Radar className="h-5 w-5" />;
      case 'star':
        return <Star className="h-5 w-5" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Check className="h-5 w-5" />;
    }
  };

  return (
    <div className={`${colorClasses.bg} p-6 rounded-lg border border-opacity-50`}>
      <div className="flex items-center mb-3">
        <div className={`${colorClasses.iconBg} p-2 rounded-full ${colorClasses.text}`}>
          {getIcon()}
        </div>
        <h3 className={`ml-3 font-semibold ${colorClasses.text}`}>{title}</h3>
      </div>
      <div className={`text-3xl font-bold mb-2 ${colorClasses.text}`}>
        {formattedValue}
      </div>
      <p className={`text-sm ${colorClasses.text} opacity-90`}>
        {description}
      </p>
    </div>
  );
};
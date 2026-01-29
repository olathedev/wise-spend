import React from 'react';
import { Category } from '../types';

interface CategoryBadgeProps {
  category: Category;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const styles = {
    Essentials: 'bg-primary/10 text-primary border-primary/20',
    Lifestyle: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    Bills: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    All: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[category]}`}>
      {category}
    </span>
  );
};

export default CategoryBadge;

import React, { useMemo } from 'react';
import { LibraryCard } from './LibraryCard';
import { LibraryItem } from '../runtime/types';

interface SectionHeaderProps {
  title: string;
  count: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, count }) => (
  <div className="flex items-center justify-between mb-2">
    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">
      {count}
    </span>
  </div>
);

interface CategoryPanelProps {
  label: string;
  items: LibraryItem[];
  onUse: (item: LibraryItem) => void;
  onCopy: (item: LibraryItem) => void;
}

const CategoryPanel: React.FC<CategoryPanelProps> = ({ label, items, onUse, onCopy }) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <SectionHeader title={label} count={items.length} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, idx) => (
          <LibraryCard
            key={`${label}-${idx}`}
            item={item}
            onUse={onUse}
            onCopy={onCopy}
          />
        ))}
      </div>
    </div>
  );
};

interface LibraryProps {
  filteredItems: LibraryItem[];
  onUse: (item: LibraryItem) => void;
  onCopy: (item: LibraryItem) => void;
}

export const Library: React.FC<LibraryProps> = ({ filteredItems, onUse, onCopy }) => {
  const grouped = useMemo(() => {
    const groups: Record<string, LibraryItem[]> = {
      Object: [],
      Field: [],
      Control: [],
      Icon: []
    };

    filteredItems.forEach(item => {
      if (item._type && groups[item._type]) {
        groups[item._type].push(item);
      }
    });

    return groups;
  }, [filteredItems]);

  return (
    <div className="space-y-6">
      <CategoryPanel label="Objects" items={grouped.Object} onUse={onUse} onCopy={onCopy} />
      <CategoryPanel label="Fields" items={grouped.Field} onUse={onUse} onCopy={onCopy} />
      <CategoryPanel label="Controls (Canvas Kit)" items={grouped.Control} onUse={onUse} onCopy={onCopy} />
      <CategoryPanel label="Icons" items={grouped.Icon} onUse={onUse} onCopy={onCopy} />
    </div>
  );
};
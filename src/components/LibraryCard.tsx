import React from 'react';
import { LibraryItem } from '../runtime/types';

interface LibraryCardProps {
  item: LibraryItem;
  onUse: (item: LibraryItem) => void;
  onCopy: (item: LibraryItem) => void;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({ item, onUse, onCopy }) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-3 hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        <div className="text-xl flex-shrink-0">
          {item.visual || "📷"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900 truncate">{item.name}</div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0 ml-2">
              <button
                className="text-[11px] px-1.5 py-0.5 rounded border bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => onUse(item)}
              >
                use
              </button>
              <button
                className="text-[11px] px-1.5 py-0.5 rounded border bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => onCopy(item)}
              >
                copy
              </button>
            </div>
          </div>
          {item.example && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.example}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags?.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
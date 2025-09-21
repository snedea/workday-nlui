import React, { useState } from 'react';
import { LibraryItem } from '../runtime/types';

interface EditableTemplateCardProps {
  item: LibraryItem;
  onUse: (item: LibraryItem) => void;
  onCopy: (item: LibraryItem) => void;
  onSave: (templateId: string, updates: { title: string; prompt: string }) => void;
  onCancel: () => void;
}

export const EditableTemplateCard: React.FC<EditableTemplateCardProps> = ({
  item,
  onUse,
  onCopy,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(item.name);
  const [prompt, setPrompt] = useState(item.onUseInsert || '');

  const handleSave = () => {
    if (item.templateId) {
      onSave(item.templateId, { title, prompt });
    }
  };

  const isChanged = title !== item.name || prompt !== (item.onUseInsert || '');

  return (
    <div className="group bg-white border border-blue-200 rounded-xl p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="text-xl flex-shrink-0">
          {item.visual || "📄"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
              placeholder="Template name..."
            />
            <div className="flex gap-1 flex-shrink-0 ml-2">
              <button
                className="text-[11px] px-1.5 py-0.5 rounded border bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => onCopy(item)}
              >
                copy
              </button>
              <button
                className="text-[11px] px-1.5 py-0.5 rounded border bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => onUse(item)}
              >
                use
              </button>
            </div>
          </div>

          <div className="mt-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 p-2 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Template prompt..."
            />
          </div>

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

          <div className="mt-3 flex justify-end gap-2">
            <button
              className="text-[11px] px-2 py-1 rounded border bg-white text-gray-600 hover:bg-gray-50"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className={`text-[11px] px-2 py-1 rounded border ${
                isChanged
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSave}
              disabled={!isChanged}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
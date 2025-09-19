import React, { useState } from 'react';
import { LIB } from '../data/library';

interface PromptComposerProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export const PromptComposer: React.FC<PromptComposerProps> = ({
  value,
  onChange,
  onGenerate,
  isGenerating = false
}) => {
  const [copied, setCopied] = useState(false);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const insertPattern = (snippet: string) => {
    const newValue = value.trim() + (value.trim() ? "\n" : "") + snippet;
    onChange(newValue);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Prompt Composer</h3>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 text-xs rounded border hover:bg-gray-50 transition-colors"
            onClick={copyAll}
            disabled={!value.trim()}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
          <button
            className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            onClick={onGenerate}
            disabled={!value.trim() || isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      <textarea
        className="mt-3 flex-1 w-full rounded-lg border p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Describe the page you want using library terms..."
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={8}
      />

      <div className="mt-3">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Patterns</h4>
        <div className="flex flex-wrap gap-2">
          {LIB.patterns.map((pattern, i) => (
            <button
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
              onClick={() => insertPattern(pattern.snippet)}
            >
              {pattern.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[11px] text-gray-500">
        Tip: Click{" "}
        <span className="text-[11px] px-1.5 py-0.5 rounded border bg-white text-gray-700">
          use
        </span>{" "}
        on any item to insert a token like{" "}
        <code className="bg-gray-100 px-1 rounded">{"[Object: Worker]"}</code>{" "}
        or a descriptive phrase into the prompt.
      </p>
    </div>
  );
};
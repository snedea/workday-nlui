import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { SearchBar } from './components/SearchBar';
import { GroupTabs } from './components/GroupTabs';
import { Library } from './components/Library';
import { PromptComposer } from './components/PromptComposer';
import { renderUi } from './runtime/renderer';
import { LIB } from './data/library';
import { LibraryItem, UiResponse } from './runtime/types';

const STORAGE_KEYS = {
  LAST_PROMPT: 'workday-nlui-last-prompt',
  LAST_RESPONSE: 'workday-nlui-last-response'
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");
  const [composer, setComposer] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_PROMPT);
    return stored || "Create a Workday-style profile page for Worker with header (avatar, Legal Name, title, Status), tabs (Profile, Job, Pay, Time Off), and a primary \"Save\" button.";
  });
  const [generatedUI, setGeneratedUI] = useState<UiResponse | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_RESPONSE);
    return stored ? JSON.parse(stored) : null;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupTabs = [
    { id: "all", label: "All" },
    { id: "object", label: "Objects" },
    { id: "field", label: "Fields" },
    { id: "control", label: "Controls" },
    { id: "icon", label: "Icons" },
  ];

  const flatLibrary = useMemo(() => {
    const withType = (arr: LibraryItem[], type: string) =>
      arr.map(x => ({ ...x, _type: type }));

    return [
      ...withType(LIB.objects, "Object"),
      ...withType(LIB.fields, "Field"),
      ...withType(LIB.controls, "Control"),
      ...withType(LIB.icons, "Icon"),
    ];
  }, []);

  const filteredItems = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return flatLibrary.filter(item => {
      const inGroup = activeGroup === "all" || item._type?.toLowerCase() === activeGroup;
      if (!inGroup) return false;
      if (!term) return true;

      return (
        item.name.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term)) ||
        item.example.toLowerCase().includes(term)
      );
    });
  }, [searchQuery, flatLibrary, activeGroup]);

  const insertToken = (item: LibraryItem) => {
    const token = `[${item._type}:${item.name}]`;
    const hint = item.example ? ` // ${item.example}` : "";
    const newValue = composer.trim() + (composer.trim() ? "\n" : "") + token + hint;
    setComposer(newValue);
  };

  const copyExample = async (item: LibraryItem) => {
    try {
      await navigator.clipboard.writeText(item.example || item.name);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleGenerate = async () => {
    if (!composer.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await axios.post('/api/generate', { prompt: composer });
      setGeneratedUI(response.data);

      localStorage.setItem(STORAGE_KEYS.LAST_PROMPT, composer);
      localStorage.setItem(STORAGE_KEYS.LAST_RESPONSE, JSON.stringify(response.data));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Generation failed';
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search');
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workday Prompt Library</h1>
          <p className="text-sm text-gray-600">
            Searchable objects, fields, controls & icons — compose prompts that map to Canvas Kit.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
          <span className="text-[11px] px-1.5 py-0.5 rounded border bg-white text-gray-700">⌘</span>
          <span>+</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded border bg-white text-gray-700">K</span>
          <span> to focus search</span>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <GroupTabs tabs={groupTabs} activeTab={activeGroup} onTabChange={setActiveGroup} />
        </div>
      </div>

      {/* Body: Library + Composer + Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Library */}
        <div className="xl:col-span-2 space-y-6">
          <Library
            filteredItems={filteredItems}
            onUse={insertToken}
            onCopy={copyExample}
          />
        </div>

        {/* Composer + Preview */}
        <div className="xl:col-span-1 space-y-4">
          <PromptComposer
            value={composer}
            onChange={setComposer}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-red-600 mr-3">⚠️</div>
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            </div>
          )}

          {/* Preview */}
          {generatedUI && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Preview</h3>
                <span className="text-xs text-gray-500">{generatedUI.title}</span>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                {renderUi(generatedUI.tree)}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="text-xs text-gray-500">
            Library grouped for clarity: <strong>Objects</strong> (Workday entities), <strong>Fields</strong> (data attributes), <strong>Controls</strong> (Canvas Kit UI), <strong>Icons</strong> (visual cues).
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
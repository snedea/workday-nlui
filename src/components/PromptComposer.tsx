import React, { useState, useRef } from 'react';
import { LIB } from '../data/library';

interface PromptComposerProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  onAddTemplate?: (templateData: {
    name: string;
    description: string;
    tags: string;
    prompt: string;
  }) => void;
  editingTemplateId?: string | null;
  editingTemplateName?: string;
  onSaveTemplate?: (templateId: string, updates: { title: string; prompt: string }) => void;
  onCancelEdit?: () => void;
  previewTitle?: string;
}

export const PromptComposer: React.FC<PromptComposerProps> = ({
  value,
  onChange,
  onGenerate,
  isGenerating = false,
  onAddTemplate,
  editingTemplateId,
  editingTemplateName = '',
  onSaveTemplate,
  onCancelEdit,
  previewTitle
}) => {
  const [copied, setCopied] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    tags: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const saveAsTemplate = () => {
    if (!value.trim()) return;

    // Pre-fill form with preview title if available, otherwise use first line
    const defaultName = previewTitle || value.split('\n')[0].substring(0, 50);
    setTemplateForm({
      name: defaultName,
      description: value.substring(0, 100) + (value.length > 100 ? '...' : ''),
      tags: 'Custom'
    });

    setShowSaveDialog(true);
  };

  const handleSaveTemplate = () => {
    if (!templateForm.name.trim() || !onAddTemplate) return;

    // Call the parent's addTemplate function
    onAddTemplate({
      name: templateForm.name,
      description: templateForm.description,
      tags: templateForm.tags,
      prompt: value
    });

    setShowSaveDialog(false);
    setTemplateForm({ name: '', description: '', tags: '' });
  };

  const handleSaveEditingTemplate = () => {
    if (!editingTemplateId || !onSaveTemplate || !editingTemplateName) return;

    onSaveTemplate(editingTemplateId, {
      title: editingTemplateName,
      prompt: value
    });
  };

  const isInEditMode = !!editingTemplateId;

  const importTemplate = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const template = JSON.parse(e.target?.result as string);
        if (template.prompt) {
          onChange(template.prompt);
        }
      } catch (error) {
        console.error('Failed to import template:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };


  return (
    <div className={`bg-white border rounded-2xl p-4 flex flex-col ${isInEditMode ? 'border-blue-300 bg-blue-50/20' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            {isInEditMode ? (
              <>Editing Template: <span className="text-blue-600">{editingTemplateName}</span></>
            ) : (
              'Prompt Composer'
            )}
          </h3>
          {isInEditMode && (
            <p className="text-xs text-blue-600 mt-1">Make your changes and click "Save Template" to update.</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 text-xs rounded border hover:bg-gray-50 transition-colors"
            onClick={copyAll}
            disabled={!value.trim()}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>

          {!isInEditMode && (
            <>
              <button
                className="px-2 py-1 text-xs rounded border hover:bg-gray-50 transition-colors"
                onClick={importTemplate}
              >
                Import Template
              </button>

              <button
                className="px-2 py-1 text-xs rounded border hover:bg-gray-50 transition-colors"
                onClick={saveAsTemplate}
                disabled={!value.trim() || !onAddTemplate}
              >
                Save as Template
              </button>
            </>
          )}

          {isInEditMode && (
            <>
              <button
                className="px-2 py-1 text-xs rounded border hover:bg-gray-50 transition-colors"
                onClick={onCancelEdit}
              >
                Cancel
              </button>

              <button
                className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={handleSaveEditingTemplate}
                disabled={!value.trim()}
              >
                Save Template
              </button>
            </>
          )}

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
        className="mt-3 w-full h-48 rounded-lg border p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[120px] max-h-[400px]"
        placeholder="Describe the page you want using library terms..."
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ scrollbarWidth: 'thin' }}
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

      {/* Hidden file input for template import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileImport}
      />

      {/* Save Template Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save as Template</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this template..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={templateForm.tags}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Custom, Finance, HCM..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSaveTemplate}
                disabled={!templateForm.name.trim() || !onAddTemplate}
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
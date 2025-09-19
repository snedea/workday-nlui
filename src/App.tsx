import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { CanvasProvider } from '@workday/canvas-kit-react';
// Remove fonts CSS import - it's not needed for v14
import '@workday/canvas-tokens-web/css/base/_variables.css';
import '@workday/canvas-tokens-web/css/brand/_variables.css';
import '@workday/canvas-tokens-web/css/system/_variables.css';
import { SearchBar } from './components/SearchBar';
import { Library } from './components/Library';
import { PromptComposer } from './components/PromptComposer';
import { renderUi } from './runtime/renderer';
import { renderCanvasUi } from './runtime/canvasRenderer';
import { LIB } from './data/library';
import { canvasIconsLibrary } from './data/canvasIcons';
import { loadTemplates } from './templates/loader';
import { LibraryItem, UiResponse } from './runtime/types';
import { on, showToast } from './runtime/actions';
import { addCustomTemplate, onTemplateChange, saveTemplateFile } from './templates/templateStore';

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
  const [templateVersion, setTemplateVersion] = useState(0); // Force re-render when templates change
  const [useCanvasRenderer, setUseCanvasRenderer] = useState(true); // Use Canvas Kit by default


  const flatLibrary = useMemo(() => {
    const withType = (arr: LibraryItem[], type: string) =>
      arr.map(x => ({ ...x, _type: type }));

    // Load templates dynamically (includes custom templates)
    const allTemplates = loadTemplates();
    const templatesAsLibraryItems = allTemplates.map(t => ({
      name: t.title,
      tags: t.tags || [], // Use tags directly from TemplateEntry
      example: t.summary,
      visual: "📄", // Template icon
      _type: "Templates",
      onUseInsert: t.prompt // Use prompt directly from TemplateEntry
    }));



    return [
      ...withType(LIB.objects, "Object"),
      ...withType(LIB.fields, "Field"),
      ...withType(LIB.controls, "Control"),
      ...withType(LIB.icons, "Icon"),
      ...canvasIconsLibrary, // Add all Canvas icons
      ...templatesAsLibraryItems,
    ];
  }, [templateVersion]); // Re-run when templates change

  const filteredItems = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return flatLibrary.filter(item => {
      // Fix the group filtering logic
      let inGroup = false;
      if (activeGroup === "all") {
        inGroup = true;
      } else if (activeGroup === "templates") {
        inGroup = item._type === "Templates";
      } else {
        // For other groups, match the pattern: "object" -> "Object", "field" -> "Field", etc.
        const expectedType = activeGroup.charAt(0).toUpperCase() + activeGroup.slice(1);
        inGroup = item._type === expectedType;
      }

      if (!inGroup) return false;
      if (!term) return true;

      return (
        item.name.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term)) ||
        item.example.toLowerCase().includes(term)
      );
    });
  }, [searchQuery, flatLibrary, activeGroup]);

  // Calculate counts for each category
  const counts = useMemo(() => {
    const totalCounts = {
      objects: flatLibrary.filter(item => item._type === "Object").length,
      fields: flatLibrary.filter(item => item._type === "Field").length,
      controls: flatLibrary.filter(item => item._type === "Control").length,
      icons: flatLibrary.filter(item => item._type === "Icon").length,
      templates: flatLibrary.filter(item => item._type === "Templates").length,
      all: flatLibrary.length
    };

    const filteredCounts = {
      objects: filteredItems.filter(item => item._type === "Object").length,
      fields: filteredItems.filter(item => item._type === "Field").length,
      controls: filteredItems.filter(item => item._type === "Control").length,
      icons: filteredItems.filter(item => item._type === "Icon").length,
      templates: filteredItems.filter(item => item._type === "Templates").length,
      all: filteredItems.length
    };

    return { total: totalCounts, filtered: filteredCounts };
  }, [flatLibrary, filteredItems]);

  const insertToken = (item: LibraryItem & { onUseInsert?: string }) => {
    // For templates, use the onUseInsert prompt directly
    if (item._type === "Templates" && item.onUseInsert) {
      const newValue = composer.trim() + (composer.trim() ? "\n\n" : "") + item.onUseInsert;
      setComposer(newValue);
      return;
    }

    // For regular library items, use token format
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

  const openPreviewInNewTab = (uiResponse: UiResponse) => {
    const previewHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${uiResponse.title} - Preview</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .btn-primary {
            @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
        }
        .btn-secondary {
            @apply px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors;
        }
    </style>
</head>
<body class="bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">${uiResponse.title}</h1>
            <p class="text-sm text-gray-600 mb-4">Generated with Workday NLUI Studio</p>
        </div>
        <div id="preview-root" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"></div>
    </div>

    <script type="text/babel">
        ${getRendererJSX()}

        const uiData = ${JSON.stringify(uiResponse.tree)};

        function App() {
            return React.createElement(RenderNode, { node: uiData });
        }

        ReactDOM.render(React.createElement(App), document.getElementById('preview-root'));
    </script>
</body>
</html>`;

    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

    // Clean up the URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const getRendererJSX = () => {
    // This is a simplified version of the renderer for the new tab
    return `
function RenderNode({ node }) {
    const { type, props = {}, children = [] } = node;

    const renderChildren = () => children.map((child, i) =>
        React.createElement(RenderNode, { key: i, node: child })
    );

    switch (type) {
        case 'Page':
            return React.createElement('div', { className: 'space-y-6' }, renderChildren());

        case 'Header':
            return React.createElement('header', { className: 'bg-white border-b border-gray-200 px-6 py-4 mb-6' }, renderChildren());

        case 'Section':
            return React.createElement('section', { className: 'space-y-4' }, renderChildren());

        case 'Card':
            return React.createElement('div', { className: 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4' },
                props.title && React.createElement('h3', { className: 'text-md font-medium text-gray-900 mb-3' }, props.title),
                renderChildren()
            );

        case 'Text':
            return React.createElement('p', { className: 'text-gray-800' }, props.content || props.children || 'Text');

        case 'Button':
            const buttonClass = props.variant === 'primary' ? 'btn-primary' : 'btn-secondary';
            return React.createElement('button', {
                className: buttonClass + ' ' + (props.className || ''),
                disabled: props.disabled
            }, props.text || props.children || 'Button');

        case 'Form':
            return React.createElement('form', { className: 'space-y-4' }, renderChildren());

        case 'Field':
            const fieldType = props.type || 'text';
            return React.createElement('div', { className: 'mb-4' },
                props.label && React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, props.label),
                fieldType === 'select'
                    ? React.createElement('select', {
                        className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                        value: props.value || ''
                    }, (props.options || []).map((opt, i) =>
                        React.createElement('option', { key: i, value: opt }, opt)
                    ))
                    : React.createElement('input', {
                        type: fieldType,
                        className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                        placeholder: props.placeholder,
                        value: props.value || ''
                    })
            );

        case 'Table':
            return React.createElement('div', { className: 'overflow-x-auto' },
                React.createElement('table', { className: 'min-w-full divide-y divide-gray-200' },
                    React.createElement('thead', { className: 'bg-gray-50' },
                        React.createElement('tr', {},
                            (props.columns || []).map((col, i) =>
                                React.createElement('th', {
                                    key: i,
                                    className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                }, col)
                            )
                        )
                    ),
                    React.createElement('tbody', { className: 'bg-white divide-y divide-gray-200' },
                        (props.rows || []).map((row, i) =>
                            React.createElement('tr', { key: i },
                                (props.columns || []).map((col, j) =>
                                    React.createElement('td', {
                                        key: j,
                                        className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                                    }, row[col] || '')
                                )
                            )
                        )
                    )
                )
            );

        case 'Badge':
            return React.createElement('span', {
                className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + (
                    props.status === 'Active' ? 'bg-green-100 text-green-800' :
                    props.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                    props.status === 'Terminated' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                )
            }, props.status || props.text || props.children || 'Badge');

        default:
            return React.createElement('div', { className: 'text-gray-500 italic' }, 'Unknown component: ' + type);
    }
}
`;
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

  // Listen for template changes and trigger re-render
  useEffect(() => {
    const unsubscribe = onTemplateChange(() => {
      setTemplateVersion(prev => prev + 1);
    });

    return unsubscribe;
  }, []);

  // Function to add a new template
  const handleAddTemplate = (templateData: {
    name: string;
    description: string;
    tags: string;
    prompt: string;
  }) => {
    const slug = templateData.name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');

    const template = {
      id: `custom/${slug}`,
      title: templateData.name,
      summary: templateData.description,
      tags: templateData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      canvasKit: [],
      prompt: templateData.prompt,
      version: "1.0",
      category: "Templates" as const
    };

    addCustomTemplate(template);

    // Also save as file to /templates directory
    try {
      saveTemplateFile(template);
      showToast(`Template "${templateData.name}" saved successfully! Check downloads for the .template.json file to add to /src/templates/custom/`, 'success');
    } catch (error) {
      showToast(`Template "${templateData.name}" saved to library. File download failed.`, 'info');
    }
  };

  // Register action handlers for template interactivity
  useEffect(() => {
    // Drawer actions
    on('openDrawer', () => {
      showToast('Drawer opened', 'info');
    });

    on('closeDrawer', () => {
      showToast('Drawer closed', 'info');
    });

    // Shift management actions
    on('submitSwapBid', (payload) => {
      const shiftInfo = payload ? `for ${payload.position || 'position'} on ${payload.date || 'selected date'}` : '';
      showToast(`Swap request submitted ${shiftInfo}`, 'success');
      // Mock: refresh My Requests (could update local state here)
    });

    on('approveRequest', (payload) => {
      const requestInfo = payload ? `Request #${payload.requestId || 'unknown'}` : 'Request';
      showToast(`${requestInfo} approved`, 'success');
    });

    on('declineRequest', (payload) => {
      const requestInfo = payload ? `Request #${payload.requestId || 'unknown'}` : 'Request';
      showToast(`${requestInfo} declined`, 'info');
    });

    // Expense report actions
    on('submitExpenseReport', (payload) => {
      const amount = payload?.total ? `$${payload.total}` : '';
      showToast(`Expense report ${amount} submitted for approval`, 'success');
    });

    on('saveDraft', () => {
      showToast('Draft saved successfully', 'success');
    });

    // Generic form submission
    on('submitForm', (payload) => {
      const formType = payload?.type || 'form';
      showToast(`${formType} submitted successfully`, 'success');
    });

    // Note: Cleanup not needed since handlers are global
  }, []);

  return (
    <CanvasProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Workday Gradient Bar */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600"></div>

        <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workday NLUI Studio</h1>
          <p className="text-xs text-gray-500 mb-1">Workday Natural Language UI Studio</p>
          <p className="text-sm text-gray-600">
            Design Workday-style interfaces with natural language prompts, reusable templates, and live preview — powered by AI and Canvas Kit patterns.
          </p>
        </div>
      </div>

      {/* Preview - Always visible */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Preview</h3>
          {generatedUI && (
            <div className="flex items-center gap-2">
              <button
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  useCanvasRenderer ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => setUseCanvasRenderer(!useCanvasRenderer)}
                title="Toggle renderer"
              >
                {useCanvasRenderer ? 'Canvas Kit' : 'Tailwind'}
              </button>
              <button
                className="px-2 py-1 text-xs rounded border hover:bg-gray-50 transition-colors"
                onClick={() => openPreviewInNewTab(generatedUI)}
                title="Open preview in new tab"
              >
                ↗
              </button>
              <span className="text-xs text-gray-500">{generatedUI.title}</span>
            </div>
          )}
        </div>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-[600px] overflow-y-auto">
          {generatedUI ? (
            useCanvasRenderer ? renderCanvasUi(generatedUI.tree) : renderUi(generatedUI.tree)
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">🎨</div>
              <p>Your generated UI will appear here</p>
              <p className="text-sm">Use the prompt composer below to create Workday-style interfaces</p>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="mb-4">
        <PromptComposer
          value={composer}
          onChange={setComposer}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          onAddTemplate={handleAddTemplate}
        />

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="flex">
              <div className="text-red-600 mr-3">⚠️</div>
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 mb-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Item Counts Display (Filters) */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4">
        <div className="flex flex-wrap gap-4 text-sm">
          {[
            { key: 'all', label: 'All', icon: '📚' },
            { key: 'objects', label: 'Objects', icon: '🏢' },
            { key: 'fields', label: 'Fields', icon: '📝' },
            { key: 'controls', label: 'Controls', icon: '🎛️' },
            { key: 'icons', label: 'Icons', icon: '🎨' },
            { key: 'templates', label: 'Templates', icon: '📄' }
          ].map(category => {
            const isActive = activeGroup === (category.key === 'objects' ? 'object' :
                                             category.key === 'fields' ? 'field' :
                                             category.key === 'controls' ? 'control' :
                                             category.key === 'icons' ? 'icon' :
                                             category.key === 'templates' ? 'templates' :
                                             category.key);
            const count = counts.filtered[category.key as keyof typeof counts.filtered];
            const total = counts.total[category.key as keyof typeof counts.total];
            const isFiltered = searchQuery.trim() !== '' || activeGroup !== 'all';

            return (
              <button
                key={category.key}
                onClick={() => {
                  setActiveGroup(category.key === 'objects' ? 'object' :
                               category.key === 'fields' ? 'field' :
                               category.key === 'controls' ? 'control' :
                               category.key === 'icons' ? 'icon' :
                               category.key === 'templates' ? 'templates' :
                               'all');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.label}:</span>
                <span className="font-semibold">
                  {isFiltered && category.key !== 'all' && count !== total
                    ? `${count} / ${total}`
                    : count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Library */}
      <div className="w-full mb-4">
        <Library
          filteredItems={filteredItems}
          onUse={insertToken}
          onCopy={copyExample}
        />
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500">
        Library grouped for clarity: <strong>Objects</strong> (Workday entities), <strong>Fields</strong> (data attributes), <strong>Controls</strong> (Canvas Kit UI), <strong>Icons</strong> (visual cues).
      </div>
    </div>
  </div>
  </CanvasProvider>
  );
}

export default App;
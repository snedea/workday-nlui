import React, { useState } from 'react';
import { UiNode } from './types';
import { emit } from './actions';

interface RenderUiProps {
  node: UiNode;
}

export const renderUi = (node: UiNode): React.ReactNode => {
  return <RenderNode key={Math.random()} node={node} />;
};

export const UiRenderer: React.FC<{ node: UiNode }> = ({ node }) => {
  return <RenderNode node={node} />;
};

const RenderNode: React.FC<RenderUiProps> = ({ node }) => {
  const { type, props = {}, children = [] } = node;

  switch (type) {
    case 'Page':
      return (
        <div className="mx-auto max-w-6xl p-4">
          {children.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </div>
      );

    case 'Header':
      return (
        <header className="bg-white border-b border-gray-200 p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {props.title || 'Header'}
          </h1>
          {children.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </header>
      );

    case 'Section':
      return (
        <section className="mb-6">
          {props.title && (
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {props.title}
            </h2>
          )}
          {children.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </section>
      );

    case 'Card':
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          {props.image && (
            <img
              src={props.image}
              alt={props.title || 'Card image'}
              className="w-full h-48 object-cover rounded-lg mb-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgODBIMTgwVjEyMEgxODBWODBIMTgwVjgwSDEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEzMCAxMDBMMTQwIDExMEwxNjAgOTBMMTgwIDEwMFYxMjBIMTIwVjEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                target.alt = '🖼️ Image not found';
              }}
            />
          )}
          {props.title && (
            <h3 className="text-md font-medium text-gray-900 mb-3">
              {props.title}
            </h3>
          )}
          {children.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </div>
      );

    case 'Tabs':
      return <TabsComponent children={children} />;

    case 'Tab':
      return (
        <div className="tab-content">
          {children.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </div>
      );

    case 'Form':
      return (
        <form className="space-y-4">
          {children.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </form>
      );

    case 'Field':
      return <FieldComponent props={props} />;

    case 'Button':
      const buttonVariant = props.variant === 'primary' ? 'btn-primary' : 'btn-secondary';
      const buttonText = props.text || props.children || 'Button';

      const handleClick = () => {
        // Map common button texts to actions
        const text = buttonText.toLowerCase();
        if (text.includes('request swap') || text.includes('swap')) {
          emit('submitSwapBid', { position: props.position, date: props.date });
        } else if (text.includes('bid')) {
          emit('submitSwapBid', { type: 'bid', position: props.position, date: props.date });
        } else if (text.includes('approve')) {
          emit('approveRequest', { requestId: props.requestId });
        } else if (text.includes('decline')) {
          emit('declineRequest', { requestId: props.requestId });
        } else if (text.includes('submit') && text.includes('expense')) {
          emit('submitExpenseReport', { total: props.total });
        } else if (text.includes('save draft')) {
          emit('saveDraft');
        } else if (text.includes('submit')) {
          emit('submitForm', { type: props.formType || 'form' });
        } else if (text.includes('open') || text.includes('view')) {
          emit('openDrawer');
        } else if (text.includes('close')) {
          emit('closeDrawer');
        }
      };

      return (
        <button
          className={`${buttonVariant} ${props.className || ''}`}
          disabled={props.disabled}
          onClick={handleClick}
        >
          {buttonText}
        </button>
      );

    case 'Text':
      return (
        <p className={`text-gray-700 ${props.className || ''}`}>
          {props.content || props.text || children}
        </p>
      );

    case 'Badge':
      const statusColors = {
        Active: 'bg-green-100 text-green-800',
        'On Leave': 'bg-yellow-100 text-yellow-800',
        Terminated: 'bg-red-100 text-red-800',
        Draft: 'bg-gray-100 text-gray-800'
      };
      const colorClass = statusColors[props.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';

      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
          {props.status || props.text || 'Badge'}
        </span>
      );

    case 'Table':
      return <TableComponent props={props} />;

    case 'Banner':
      const bannerStyle = props.image
        ? { backgroundImage: `url(${props.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {};

      return (
        <div
          className={`${props.image ? 'text-white' : 'bg-blue-50 text-blue-800'} border border-blue-200 rounded-lg p-4 mb-4 relative overflow-hidden`}
          style={bannerStyle}
        >
          {props.image && (
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          )}
          <div className="flex relative z-10">
            <div className={`${props.image ? 'text-white' : 'text-blue-600'} mr-3`}>📢</div>
            <div>
              {props.message || props.text || 'Information banner'}
            </div>
          </div>
        </div>
      );

    case 'Toast':
      return (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            {props.message || props.text || 'Success!'}
          </div>
        </div>
      );

    case 'Modal':
      return <ModalComponent props={props} children={children} />;

    case 'Icon':
      const iconMap: Record<string, string> = {
        User: '👤',
        Building: '🏢',
        Calendar: '📅',
        Search: '🔍',
        Alert: '⚠️',
        Check: '✅'
      };
      return (
        <span className={`inline-block ${props.className || ''}`}>
          {iconMap[props.name] || '📷'}
        </span>
      );

    case 'Avatar':
      return <AvatarComponent props={props} />;

    default:
      return (
        <div className="p-2 border border-dashed border-gray-300 rounded">
          <span className="text-xs text-gray-500">
            Unknown component: {type}
          </span>
          {children.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </div>
      );
  }
};

const TabsComponent: React.FC<{ children: UiNode[] }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mb-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {children.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.props?.label || `Tab ${index + 1}`}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {children[activeTab] && <RenderNode node={children[activeTab]} />}
      </div>
    </div>
  );
};

const FieldComponent: React.FC<{ props: any }> = ({ props }) => {
  const { kind = 'text', label, required, readOnly, options } = props;

  const fieldClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm";

  const renderField = () => {
    switch (kind) {
      case 'select':
        return (
          <select className={fieldClasses} disabled={readOnly}>
            <option value="">Select...</option>
            {options?.map((option: string, i: number) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'date':
        return <input type="date" className={fieldClasses} readOnly={readOnly} />;

      case 'combobox':
        return (
          <input
            type="text"
            className={fieldClasses}
            placeholder="Start typing to search..."
            readOnly={readOnly}
          />
        );

      default:
        return <input type="text" className={fieldClasses} readOnly={readOnly} />;
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
    </div>
  );
};

const TableComponent: React.FC<{ props: any }> = ({ props }) => {
  const { columns = [], rows = [] } = props;

  const renderCellContent = (content: string) => {
    if (!content || content === '—') return '—';

    // Enhanced image URL detection for badges and various image services
    const imageUrlPattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
    const imageDomainPatterns = [
      'images.credly.com',
      'upload.wikimedia.org',
      'via.placeholder.com',
      'badgelibraryprovider',
      'scrumalliance.org/images',
      'hawaii.edu',
      '/images/',
      '/badge',
      'cdn.',
      'amazonaws.com'
    ];

    const isImageUrl = imageUrlPattern.test(content) ||
      imageDomainPatterns.some(pattern => content.includes(pattern)) ||
      (content.startsWith('http') && content.toLowerCase().includes('image'));

    if (isImageUrl) {
      return (
        <div className="flex items-center justify-center">
          <img
            src={content}
            alt="Badge"
            className="w-12 h-12 object-contain rounded border border-gray-200 bg-white"
            onError={(e) => {
              // Replace with placeholder on error
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkgzMlYzMkgzMlYxNkgzMlYxNkgxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDI0TDI0IDI4TDMyIDIwTDMyIDI0VjI4SDE2VjI0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
              target.alt = '🏆 Badge';
              target.title = `Failed to load: ${content}`;
            }}
            title={content}
          />
        </div>
      );
    }

    return content;
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column: string, i: number) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row: Record<string, string>, i: number) => (
            <tr key={i}>
              {columns.map((column: string, j: number) => (
                <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    {renderCellContent(row[column])}
                    <span className="hidden"></span>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ModalComponent: React.FC<{ props: any; children: UiNode[] }> = ({ props, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {props.title || 'Modal'}
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div>
          {children.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={() => setIsOpen(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="btn-primary"
          >
            {props.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AvatarComponent: React.FC<{ props: any }> = ({ props }) => {
  const {
    src,
    alt = 'Avatar',
    name = '',
    size = 'md',
    variant = 'circle'
  } = props;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl'
  };

  const variantClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg'
  };

  const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;
  const variantClass = variantClasses[variant as keyof typeof variantClasses] || variantClasses.circle;

  // If we have an image source, try to display it
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} ${variantClass} object-cover border-2 border-gray-200`}
        onError={(e) => {
          // Fallback to initials avatar on error
          const target = e.target as HTMLImageElement;
          const parent = target.parentElement!;
          target.style.display = 'none';

          const fallback = document.createElement('div');
          fallback.className = `${sizeClass} ${variantClass} bg-workday-blue text-white flex items-center justify-center font-semibold border-2 border-gray-200`;
          fallback.textContent = name ? name.charAt(0).toUpperCase() : '?';
          parent.appendChild(fallback);
        }}
      />
    );
  }

  // Fallback to initials avatar
  return (
    <div className={`${sizeClass} ${variantClass} bg-workday-blue text-white flex items-center justify-center font-semibold border-2 border-gray-200`}>
      {name ? name.charAt(0).toUpperCase() : '?'}
    </div>
  );
};
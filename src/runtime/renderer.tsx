import React, { useState } from 'react';
import { UiNode } from './types';

interface RenderUiProps {
  node: UiNode;
}

export const renderUi = (node: UiNode): React.ReactNode => {
  return <RenderNode key={Math.random()} node={node} />;
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
      return (
        <button
          className={`${buttonVariant} ${props.className || ''}`}
          disabled={props.disabled}
        >
          {props.text || props.children || 'Button'}
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
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="text-blue-600 mr-3">📢</div>
            <div className="text-blue-800">
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
                  {row[column] || '—'}
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
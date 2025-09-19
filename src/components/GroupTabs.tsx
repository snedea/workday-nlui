import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface GroupTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const GroupTabs: React.FC<GroupTabsProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex gap-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
            activeTab === tab.id
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
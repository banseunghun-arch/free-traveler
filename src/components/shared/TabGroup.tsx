import { ReactNode, useState } from "react";
import {
  tabListRoleAttrs,
  tabRoleAttrs,
  tabPanelRoleAttrs,
  focusRingClasses,
} from "@/lib/a11y";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabGroupProps {
  tabs: Tab[];
  defaultTabId?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export function TabGroup({
  tabs,
  defaultTabId,
  onTabChange,
  className = "",
}: TabGroupProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className={className}>
      <div {...tabListRoleAttrs} className="flex border-b border-[#e5e3e0]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            {...tabRoleAttrs(activeTabId === tab.id, tab.id)}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
              activeTabId === tab.id
                ? "text-[#d03e1b] border-b-[#d03e1b]"
                : "text-[#767676] border-b-transparent hover:text-[#262626]"
            } ${focusRingClasses}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          {...tabPanelRoleAttrs(tab.id)}
          hidden={activeTabId !== tab.id}
          className="py-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

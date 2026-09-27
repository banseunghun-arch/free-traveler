// Accessibility utilities for ARIA/semantic attributes and keyboard handling
// design-reference/D-001/DESIGN.md §2: --color-focus-ring #1d4ed8, 2px offset 2px

export const focusRingClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]";

export const dialogRoleAttrs = {
  role: "dialog",
  "aria-modal": true,
} as const;

export const tabListRoleAttrs = {
  role: "tablist",
} as const;

export const tabRoleAttrs = (isSelected: boolean, tabId: string) => ({
  role: "tab",
  "aria-selected": isSelected,
  "aria-controls": `${tabId}-panel`,
  tabIndex: isSelected ? 0 : -1,
});

export const tabPanelRoleAttrs = (tabId: string) => ({
  role: "tabpanel",
  id: `${tabId}-panel`,
  "aria-labelledby": tabId,
});


// Keyboard event helpers
export const isEscapeKey = (e: React.KeyboardEvent) => e.key === "Escape";
export const isEnterKey = (e: React.KeyboardEvent) => e.key === "Enter";
export const isSpaceKey = (e: React.KeyboardEvent) => e.key === " ";
export const isTabKey = (e: React.KeyboardEvent) => e.key === "Tab";

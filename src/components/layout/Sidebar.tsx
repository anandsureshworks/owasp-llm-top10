import React from "react";

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="hidden w-full max-w-xs shrink-0 xl:block">
      <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pb-8">
        {children}
      </div>
    </aside>
  );
}

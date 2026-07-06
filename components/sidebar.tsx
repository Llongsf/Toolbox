"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Braces, Clock, Binary } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { toolCategories, getToolsByCategory, type ToolCategory } from "@/lib/tools-config";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  "json-formatter": <Braces className="h-4 w-4" />,
  "timestamp-converter": <Clock className="h-4 w-4" />,
  "base64-encoder": <Binary className="h-4 w-4" />,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-60 flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
            <Braces className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">DevOffice Kit</span>
            <span className="text-[10px] leading-tight text-muted-foreground">
              程序员百宝箱
            </span>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          {toolCategories.map((category) => {
            const categoryTools = getToolsByCategory(category as ToolCategory);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category} className="pb-3">
                <h4 className="mb-1 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                  {category}
                </h4>
                {categoryTools.map((tool) => {
                  const isActive = pathname === `/tools/${tool.id}`;
                  return (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {iconMap[tool.id] || <Braces className="h-4 w-4" />}
                      <span>{tool.name}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        <p className="text-center text-[10px] text-muted-foreground">
          DevOffice Kit v0.1.0
        </p>
      </div>
    </aside>
  );
}
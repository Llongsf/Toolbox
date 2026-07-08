"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Braces, Clock, Binary } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toolCategories, getToolsByCategory, type ToolCategory } from "@/lib/tools-config";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n";

const iconMap: Record<string, React.ReactNode> = {
  "json-formatter": <Braces className="h-4 w-4" />,
  "timestamp-converter": <Clock className="h-4 w-4" />,
  "base64-encoder": <Binary className="h-4 w-4" />,
};

const categoryKeyMap: Record<string, TranslationKey> = {
  "编码解码": "category.encode_decode",
  "数据格式化": "category.data_format",
  "文本处理": "category.text_process",
  "开发工具": "category.dev_tools",
};

const toolNameKeyMap: Record<string, TranslationKey> = {
  "json-formatter": "tool.json_formatter",
  "timestamp-converter": "tool.timestamp_converter",
  "base64-encoder": "tool.base64_encoder",
};

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-60 flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
            <Braces className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">
              {t("sidebar.title")}
            </span>
            <span className="text-[10px] leading-tight text-muted-foreground">
              {t("sidebar.subtitle")}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          {toolCategories.map((category) => {
            const categoryTools = getToolsByCategory(category as ToolCategory);
            if (categoryTools.length === 0) return null;

            const categoryKey = categoryKeyMap[category];
            return (
              <div key={category} className="pb-3">
                <h4 className="mb-1 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                  {categoryKey ? t(categoryKey) : category}
                </h4>
                {categoryTools.map((tool) => {
                  const isActive = pathname === `/tools/${tool.id}`;
                  const toolNameKey = toolNameKeyMap[tool.id];
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
                      <span>{toolNameKey ? t(toolNameKey) : tool.name}</span>
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
          {t("sidebar.version")}
        </p>
      </div>
    </aside>
  );
}
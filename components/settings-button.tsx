"use client";

import * as React from "react";
import { Settings, X, Sun, Moon, Monitor, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

export function SettingsButton() {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Floating Settings Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200",
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          open && "rotate-90"
        )}
        aria-label={t("settings.title")}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <Settings className="h-5 w-5" />
        )}
      </button>

      {/* Settings Panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="fixed bottom-20 right-6 z-50 w-72 rounded-xl border bg-card p-4 shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-200">
            <h3 className="mb-4 text-sm font-semibold">
              {t("settings.title")}
            </h3>

            {/* Theme Section */}
            <div className="mb-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                {theme === "dark" ? (
                  <Moon className="h-3.5 w-3.5" />
                ) : theme === "light" ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Monitor className="h-3.5 w-3.5" />
                )}
                {t("settings.theme")}
              </label>
              <div className="flex gap-1.5">
                {([
                  { value: "light", icon: Sun, label: t("settings.theme_light") },
                  { value: "dark", icon: Moon, label: t("settings.theme_dark") },
                  { value: "system", icon: Monitor, label: t("settings.theme_system") },
                ] as const).map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setTheme(item.value)}
                    className={cn(
                      "flex flex-1 flex-col items-center gap-1 rounded-lg border px-2 py-2 text-xs transition-colors",
                      theme === item.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Section */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Languages className="h-3.5 w-3.5" />
                {t("settings.language")}
              </label>
              <div className="flex gap-1.5">
                {([
                  { value: "zh" as const, label: t("settings.language_zh") },
                  { value: "en" as const, label: t("settings.language_en") },
                ]).map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setLocale(item.value)}
                    className={cn(
                      "flex flex-1 items-center justify-center rounded-lg border px-3 py-2 text-xs transition-colors",
                      locale === item.value
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Version */}
            <div className="mt-4 border-t pt-3 text-center text-[10px] text-muted-foreground">
              {mounted ? t("sidebar.version") : "DevOffice Kit v0.1.0"}
            </div>
          </div>
        </>
      )}
    </>
  );
}
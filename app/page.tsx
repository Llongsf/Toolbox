"use client";

import Link from "next/link";
import { Braces, Clock, Binary, ArrowRight } from "lucide-react";
import { tools } from "@/lib/tools-config";
import { useI18n } from "@/components/i18n-provider";
import type { TranslationKey } from "@/lib/i18n";

const iconMap: Record<string, React.ReactNode> = {
  "json-formatter": <Braces className="h-8 w-8" />,
  "timestamp-converter": <Clock className="h-8 w-8" />,
  "base64-encoder": <Binary className="h-8 w-8" />,
};

const toolNameKeyMap: Record<string, TranslationKey> = {
  "json-formatter": "tool.json_formatter",
  "timestamp-converter": "tool.timestamp_converter",
  "base64-encoder": "tool.base64_encoder",
};

const toolDescKeyMap: Record<string, TranslationKey> = {
  "json-formatter": "tool.json_formatter.desc",
  "timestamp-converter": "tool.timestamp_converter.desc",
  "base64-encoder": "tool.base64_encoder.desc",
};

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="py-8">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          DevOffice Kit
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("home.subtitle")}
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const nameKey = toolNameKeyMap[tool.id];
          const descKey = toolDescKeyMap[tool.id];
          return (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="group rounded-lg border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {iconMap[tool.id] || <Braces className="h-8 w-8" />}
              </div>
              <h3 className="mb-1 font-semibold">
                {nameKey ? t(nameKey) : tool.name}
              </h3>
              <p className="mb-3 text-sm text-muted-foreground">
                {descKey ? t(descKey) : tool.description}
              </p>
              <div className="flex items-center text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                {t("home.start")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
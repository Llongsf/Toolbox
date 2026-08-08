"use client";

import { JsonFormatter } from "@/components/tools/json-formatter";
import { TimestampConverter } from "@/components/tools/timestamp-converter";
import { Base64Encoder } from "@/components/tools/base64-encoder";
import { UrlEncoder } from "@/components/tools/url-encoder";
import { HashCalculator } from "@/components/tools/hash-calculator";
import { JwtDecoder } from "@/components/tools/jwt-decoder";
import { RegexTester } from "@/components/tools/regex-tester";
import { ColorConverter } from "@/components/tools/color-converter";
import { NumberBaseConverter } from "@/components/tools/number-base-converter";
import { TextDiff } from "@/components/tools/text-diff";
import { PasswordGenerator } from "@/components/tools/password-generator";
import { LoremGenerator } from "@/components/tools/lorem-generator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import type { ToolConfig } from "@/lib/tools-config";
import type { TranslationKey } from "@/lib/i18n";

const toolComponents: Record<string, React.ComponentType> = {
  "json-formatter": JsonFormatter,
  "timestamp-converter": TimestampConverter,
  "base64-encoder": Base64Encoder,
  "url-encoder": UrlEncoder,
  "hash-calculator": HashCalculator,
  "jwt-decoder": JwtDecoder,
  "regex-tester": RegexTester,
  "color-converter": ColorConverter,
  "number-base-converter": NumberBaseConverter,
  "text-diff": TextDiff,
  "password-generator": PasswordGenerator,
  "lorem-generator": LoremGenerator,
};

const toolDescKeyMap: Record<string, TranslationKey> = {
  "json-formatter": "tool.json_formatter.desc",
  "timestamp-converter": "tool.timestamp_converter.desc",
  "base64-encoder": "tool.base64_encoder.desc",
  "dnsdumpster": "tool.dnsdumpster.desc",
  "crt-sh": "tool.crt_sh.desc",
};

const toolNameKeyMap: Record<string, TranslationKey> = {
  "json-formatter": "tool.json_formatter",
  "timestamp-converter": "tool.timestamp_converter",
  "base64-encoder": "tool.base64_encoder",
  "dnsdumpster": "tool.dnsdumpster",
  "crt-sh": "tool.crt_sh",
};

export function ToolView({
  toolId,
  tool,
}: {
  toolId: string;
  tool: ToolConfig;
}) {
  const { t } = useI18n();
  const ToolComponent = toolComponents[toolId];

  const nameKey = toolNameKeyMap[toolId];
  const descKey = toolDescKeyMap[toolId];

  if (tool.externalUrl) {
    return (
      <div className="py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {nameKey ? t(nameKey) : tool.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {descKey ? t(descKey) : tool.description}
          </p>
        </div>
        <div className="flex h-[50vh] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg">{t("ext.title")}</CardTitle>
              <CardDescription>{t("ext.title.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 break-all text-sm text-muted-foreground">
                <ExternalLink className="h-4 w-4 shrink-0" />
                <span>{tool.externalUrl}</span>
              </div>
              <Button asChild size="lg" className="w-full">
                <a
                  href={tool.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  {t("ext.open")}
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">{t("ext.notice")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!ToolComponent) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t("tool.coming_soon")}</h2>
          <p className="mt-2 text-muted-foreground">
            {t("tool.coming_soon.desc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {nameKey ? t(nameKey) : tool.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {descKey ? t(descKey) : tool.description}
        </p>
      </div>
      <ToolComponent />
    </div>
  );
}

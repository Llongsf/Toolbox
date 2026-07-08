"use client";

import { JsonFormatter } from "@/components/tools/json-formatter";
import { TimestampConverter } from "@/components/tools/timestamp-converter";
import { Base64Encoder } from "@/components/tools/base64-encoder";
import { UrlEncoder } from "@/components/tools/url-encoder";
import { HashCalculator } from "@/components/tools/hash-calculator";
import { JwtDecoder } from "@/components/tools/jwt-decoder";
import { RegexTester } from "@/components/tools/regex-tester";
import { UuidGenerator } from "@/components/tools/uuid-generator";
import { ColorConverter } from "@/components/tools/color-converter";
import { NumberBaseConverter } from "@/components/tools/number-base-converter";
import { TextDiff } from "@/components/tools/text-diff";
import { PasswordGenerator } from "@/components/tools/password-generator";
import { LoremGenerator } from "@/components/tools/lorem-generator";
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
  "uuid-generator": UuidGenerator,
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
};

const toolNameKeyMap: Record<string, TranslationKey> = {
  "json-formatter": "tool.json_formatter",
  "timestamp-converter": "tool.timestamp_converter",
  "base64-encoder": "tool.base64_encoder",
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

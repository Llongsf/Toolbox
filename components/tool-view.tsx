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
import type { ToolConfig } from "@/lib/tools-config";

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

export function ToolView({
  toolId,
  tool,
}: {
  toolId: string;
  tool: ToolConfig;
}) {
  const ToolComponent = toolComponents[toolId];

  if (!ToolComponent) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">工具开发中</h2>
          <p className="mt-2 text-muted-foreground">
            该工具尚未实现，敬请期待
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
        <p className="mt-1 text-muted-foreground">{tool.description}</p>
      </div>
      <ToolComponent />
    </div>
  );
}

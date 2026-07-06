"use client";

import { JsonFormatter } from "@/components/tools/json-formatter";
import { TimestampConverter } from "@/components/tools/timestamp-converter";
import { Base64Encoder } from "@/components/tools/base64-encoder";
import type { ToolConfig } from "@/lib/tools-config";

const toolComponents: Record<string, React.ComponentType> = {
  "json-formatter": JsonFormatter,
  "timestamp-converter": TimestampConverter,
  "base64-encoder": Base64Encoder,
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
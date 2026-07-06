import { notFound } from "next/navigation";
import { getToolById, tools } from "@/lib/tools-config";
import { ToolView } from "@/components/tool-view";

export function generateStaticParams() {
  return tools.map((tool) => ({
    toolId: tool.id,
  }));
}

export default function ToolPage({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  // In Next.js 15 with static export, params is resolved at build time
  // We need to await it but this is a server component so we can use async
  return <ToolViewWrapper params={params} />;
}

async function ToolViewWrapper({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const { toolId } = await params;
  const tool = getToolById(toolId);

  if (!tool) {
    notFound();
  }

  return <ToolView toolId={toolId} tool={tool} />;
}
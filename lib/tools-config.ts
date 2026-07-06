export interface ToolConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: string;
}

export const toolCategories = [
  "编码解码",
  "数据格式化",
  "文本处理",
  "开发工具",
] as const;

export type ToolCategory = (typeof toolCategories)[number];

export const tools: ToolConfig[] = [
  {
    id: "json-formatter",
    name: "JSON 格式化",
    category: "数据格式化",
    description: "格式化、压缩 JSON 数据，支持错误定位",
  },
  {
    id: "timestamp-converter",
    name: "时间戳转换",
    category: "开发工具",
    description: "时间戳与日期时间的相互转换",
  },
  {
    id: "base64-encoder",
    name: "Base64 编解码",
    category: "编码解码",
    description: "文本的 Base64 编码与解码",
  },
];

export const getToolsByCategory = (category: ToolCategory): ToolConfig[] => {
  return tools.filter((tool) => tool.category === category);
};

export const getToolById = (id: string): ToolConfig | undefined => {
  return tools.find((tool) => tool.id === id);
};
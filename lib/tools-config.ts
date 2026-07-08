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
  {
    id: "url-encoder",
    name: "URL 编解码",
    category: "编码解码",
    description: "URL/URI 组件的编码与解码，支持中文",
  },
  {
    id: "hash-calculator",
    name: "哈希计算器",
    category: "编码解码",
    description: "计算 MD5 / SHA-1 / SHA-256 / SHA-512 哈希值",
  },
  {
    id: "jwt-decoder",
    name: "JWT 解码器",
    category: "编码解码",
    description: "解析 JWT 令牌的 Header 与 Payload，检查过期",
  },
  {
    id: "regex-tester",
    name: "正则表达式测试",
    category: "开发工具",
    description: "实时测试正则匹配，高亮显示并展示捕获组",
  },
  {
    id: "uuid-generator",
    name: "UUID 生成器",
    category: "开发工具",
    description: "生成 UUID v4 / v7，支持批量与格式自定义",
  },
  {
    id: "color-converter",
    name: "颜色转换器",
    category: "开发工具",
    description: "HEX / RGB / HSL 颜色互转与实时预览",
  },
  {
    id: "number-base-converter",
    name: "进制转换器",
    category: "开发工具",
    description: "二/八/十/十六进制互转，支持大数",
  },
  {
    id: "text-diff",
    name: "文本差异对比",
    category: "文本处理",
    description: "并排对比两段文本，高亮增删行",
  },
  {
    id: "password-generator",
    name: "密码生成器",
    category: "文本处理",
    description: "生成强随机密码，含强度评估",
  },
  {
    id: "lorem-generator",
    name: "Lorem 文本生成",
    category: "文本处理",
    description: "生成占位文本，按段落/句子/单词",
  },
];

export const getToolsByCategory = (category: ToolCategory): ToolConfig[] => {
  return tools.filter((tool) => tool.category === category);
};

export const getToolById = (id: string): ToolConfig | undefined => {
  return tools.find((tool) => tool.id === id);
};

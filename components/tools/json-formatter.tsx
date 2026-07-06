"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Trash2, Minimize2, AlignLeft } from "lucide-react";

export function JsonFormatter() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState("");

  const formatJson = () => {
    setError("");
    if (!input.trim()) {
      setError("请输入 JSON 字符串");
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message);
      setOutput("");
    }
  };

  const compressJson = () => {
    setError("");
    if (!input.trim()) {
      setError("请输入 JSON 字符串");
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message);
      setOutput("");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // fallback
      const textArea = document.createElement("textarea");
      textArea.value = output;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      {/* Input */}
      <Card className="flex flex-1 flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">输入</CardTitle>
          <CardDescription>粘贴或输入 JSON 字符串</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <Textarea
            className="flex-1 min-h-[300px] font-mono text-sm"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={formatJson} size="sm">
              <AlignLeft className="mr-1 h-4 w-4" />
              格式化
            </Button>
            <Button onClick={compressJson} variant="secondary" size="sm">
              <Minimize2 className="mr-1 h-4 w-4" />
              压缩
            </Button>
            <Button onClick={clearAll} variant="outline" size="sm">
              <Trash2 className="mr-1 h-4 w-4" />
              清空
            </Button>
          </div>
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              ❌ {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Output */}
      <Card className="flex flex-1 flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">输出</CardTitle>
              <CardDescription>格式化后的 JSON</CardDescription>
            </div>
            <Button onClick={copyOutput} variant="outline" size="sm" disabled={!output}>
              <Copy className="mr-1 h-4 w-4" />
              复制
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <pre className="h-full min-h-[300px] overflow-auto rounded-md bg-muted p-4 font-mono text-sm">
            {output || (
              <span className="text-muted-foreground">格式化结果将显示在这里...</span>
            )}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
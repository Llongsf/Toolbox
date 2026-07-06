"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Trash2, Lock, Unlock } from "lucide-react";

export function Base64Encoder() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const encode = () => {
    setError("");
    setOutput("");
    if (!input) {
      setError("请输入要编码的文本");
      return;
    }
    try {
      const encoded = btoa(
        encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
      setOutput(encoded);
    } catch {
      setError("编码失败，请检查输入内容");
    }
  };

  const decode = () => {
    setError("");
    setOutput("");
    if (!input) {
      setError("请输入要解码的 Base64 字符串");
      return;
    }
    try {
      const decoded = decodeURIComponent(
        Array.from(atob(input), (c) =>
          "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        ).join("")
      );
      setOutput(decoded);
    } catch {
      setError("解码失败，请检查输入是否为有效的 Base64 字符串");
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
          <CardDescription>输入要进行 Base64 编解码的文本</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <Textarea
            className="flex-1 min-h-[300px] font-mono text-sm"
            placeholder="输入文本或 Base64 字符串..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={encode} size="sm">
              <Lock className="mr-1 h-4 w-4" />
              编码
            </Button>
            <Button onClick={decode} variant="secondary" size="sm">
              <Unlock className="mr-1 h-4 w-4" />
              解码
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
              <CardDescription>编解码结果</CardDescription>
            </div>
            <Button onClick={copyOutput} variant="outline" size="sm" disabled={!output}>
              <Copy className="mr-1 h-4 w-4" />
              {copied ? "已复制" : "复制"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <pre className="h-full min-h-[300px] overflow-auto rounded-md bg-muted p-4 font-mono text-sm whitespace-pre-wrap break-all">
            {output || (
              <span className="text-muted-foreground">结果将显示在这里...</span>
            )}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
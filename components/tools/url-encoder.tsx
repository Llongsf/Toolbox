"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Copy, Trash2, Lock, Unlock, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function UrlEncoder() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState("");
  const [mode, setMode] = React.useState<"component" | "uri">("component");

  const encode = () => {
    setError("");
    setOutput("");
    if (!input) {
      setError("请输入要编码的文本");
      return;
    }
    try {
      setOutput(
        mode === "component" ? encodeURIComponent(input) : encodeURI(input)
      );
    } catch {
      setError("编码失败，请检查输入内容");
    }
  };

  const decode = () => {
    setError("");
    setOutput("");
    if (!input) {
      setError("请输入要解码的字符串");
      return;
    }
    try {
      setOutput(
        mode === "component"
          ? decodeURIComponent(input)
          : decodeURI(input)
      );
    } catch {
      setError("解码失败，请检查输入是否为合法的已编码字符串");
    }
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setError("");
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
      const ta = document.createElement("textarea");
      ta.value = output;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      <Card className="flex flex-1 flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">输入</CardTitle>
          <CardDescription>输入要进行 URL 编解码的文本</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <Textarea
            className="flex-1 min-h-[300px] font-mono text-sm"
            placeholder="输入文本或已编码的 URL..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
          />
          <div className="flex rounded-md border overflow-hidden w-fit">
            <button
              type="button"
              onClick={() => setMode("component")}
              className={cn(
                "px-3 py-1.5 text-xs transition-colors",
                mode === "component"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent"
              )}
            >
              组件编码 (encodeURIComponent)
            </button>
            <button
              type="button"
              onClick={() => setMode("uri")}
              className={cn(
                "px-3 py-1.5 text-xs transition-colors",
                mode === "uri"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent"
              )}
            >
              整体 URI (encodeURI)
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={encode} size="sm">
              <Lock className="mr-1 h-4 w-4" />
              编码
            </Button>
            <Button onClick={decode} variant="secondary" size="sm">
              <Unlock className="mr-1 h-4 w-4" />
              解码
            </Button>
            <Button onClick={swap} variant="outline" size="sm" disabled={!output}>
              <ArrowRightLeft className="mr-1 h-4 w-4" />
              交换
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

      <Card className="flex flex-1 flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">输出</CardTitle>
              <CardDescription>编解码结果</CardDescription>
            </div>
            <Button onClick={copyOutput} variant="outline" size="sm" disabled={!output}>
              <Copy className="mr-1 h-4 w-4" />
              复制
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

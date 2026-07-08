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
import { Copy, Trash2 } from "lucide-react";
import { hashAlgorithms, calculateHash } from "@/lib/hash";

export function HashCalculator() {
  const [input, setInput] = React.useState("");
  const [hashes, setHashes] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    if (!input) {
      setHashes({});
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      const entries: Record<string, string> = {};
      for (const algo of hashAlgorithms) {
        try {
          entries[algo] = await calculateHash(algo, input);
        } catch {
          entries[algo] = "计算失败";
        }
      }
      if (!cancelled) {
        setHashes(entries);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  const clearAll = () => {
    setInput("");
    setHashes({});
  };

  const copy = async (algo: string) => {
    const value = hashes[algo];
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(algo);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <Card className="flex flex-1 flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">输入</CardTitle>
          <CardDescription>输入要计算哈希的文本</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <Textarea
            className="flex-1 min-h-[300px] font-mono text-sm"
            placeholder="输入文本以计算哈希值..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={clearAll} variant="outline" size="sm">
              <Trash2 className="mr-1 h-4 w-4" />
              清空
            </Button>
          </div>
          {input && (
            <p className="text-xs text-muted-foreground">
              {new Blob([input]).size} 字节 · {input.length} 字符
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-1 flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">哈希结果</CardTitle>
          <CardDescription>
            {loading ? "计算中..." : "支持 MD5 / SHA-1 / SHA-256 / SHA-384 / SHA-512"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          {hashAlgorithms.map((algo) => (
            <div key={algo} className="rounded-md border p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {algo}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7"
                  disabled={!hashes[algo]}
                  onClick={() => copy(algo)}
                >
                  {copied === algo ? "已复制" : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <p className="break-all font-mono text-xs">
                {hashes[algo] || (
                  <span className="text-muted-foreground">—</span>
                )}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

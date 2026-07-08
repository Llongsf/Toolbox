"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Copy, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

function uuidv4(): string {
  return crypto.randomUUID();
}

function uuidv7(): string {
  const ms = BigInt(Date.now());
  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);
  const bytes = new Uint8Array(16);
  bytes[0] = Number((ms >> 40n) & 0xffn);
  bytes[1] = Number((ms >> 32n) & 0xffn);
  bytes[2] = Number((ms >> 24n) & 0xffn);
  bytes[3] = Number((ms >> 16n) & 0xffn);
  bytes[4] = Number((ms >> 8n) & 0xffn);
  bytes[5] = Number(ms & 0xffn);
  bytes[6] = (rand[0] & 0x0f) | 0x70; // version 7
  bytes[7] = rand[1];
  bytes[8] = (rand[2] & 0x3f) | 0x80; // variant 10
  bytes[9] = rand[3];
  for (let i = 10; i < 16; i++) bytes[i] = rand[i - 6];
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function format(uuid: string, uppercase: boolean, hyphen: boolean): string {
  let s = hyphen ? uuid : uuid.replace(/-/g, "");
  if (uppercase) s = s.toUpperCase();
  return s;
}

export function UuidGenerator() {
  const [version, setVersion] = React.useState<"v4" | "v7">("v4");
  const [count, setCount] = React.useState(1);
  const [uppercase, setUppercase] = React.useState(false);
  const [hyphen, setHyphen] = React.useState(true);
  const [results, setResults] = React.useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const generate = React.useCallback(() => {
    const n = Math.max(1, Math.min(100, count || 1));
    const list: string[] = [];
    for (let i = 0; i < n; i++) {
      const raw = version === "v4" ? uuidv4() : uuidv7();
      list.push(format(raw, uppercase, hyphen));
    }
    setResults(list);
  }, [version, count, uppercase, hyphen]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const copyOne = async (s: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(s);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      /* ignore */
    }
  };

  const copyAll = async () => {
    if (results.length === 0) return;
    try {
      await navigator.clipboard.writeText(results.join("\n"));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">生成选项</CardTitle>
          <CardDescription>选择版本与格式，实时生成 UUID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex rounded-md border overflow-hidden w-fit">
              {(["v4", "v7"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVersion(v)}
                  className={cn(
                    "px-4 py-1.5 text-sm transition-colors",
                    version === v
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent"
                  )}
                >
                  UUID {v}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">数量</label>
              <Input
                type="number"
                min={1}
                max={100}
                className="w-24"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>
            <Button onClick={generate} variant="outline" size="sm">
              <RefreshCw className="mr-1 h-4 w-4" />
              重新生成
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hyphen}
                onChange={(e) => setHyphen(e.target.checked)}
                className="h-4 w-4"
              />
              包含连字符
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="h-4 w-4"
              />
              大写
            </label>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">结果</CardTitle>
              <CardDescription>共 {results.length} 个 UUID</CardDescription>
            </div>
            <Button onClick={copyAll} variant="outline" size="sm" disabled={results.length === 0}>
              <Copy className="mr-1 h-4 w-4" />
              复制全部
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] space-y-1 overflow-auto">
            {results.map((uuid, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border px-3 py-1.5"
              >
                <span className="font-mono text-sm break-all">{uuid}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-7 shrink-0"
                  onClick={() => copyOne(uuid, i)}
                >
                  {copiedIdx === i ? "已复制" : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  number: "0123456789",
  symbol: "!@#$%^&*()-_=+[]{};:,.?/",
};
const AMBIGUOUS = /[Il1O0o]/g;

function secureRandomInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function strengthScore(pw: string, charsetSize: number): number {
  if (!pw) return 0;
  const entropy = pw.length * Math.log2(Math.max(charsetSize, 1));
  if (entropy < 28) return 1;
  if (entropy < 36) return 2;
  if (entropy < 60) return 3;
  if (entropy < 128) return 4;
  return 5;
}

const strengthLabels = ["", "很弱", "弱", "一般", "强", "非常强"];
const strengthColors = [
  "",
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-emerald-500",
];

export function PasswordGenerator() {
  const [length, setLength] = React.useState(16);
  const [upper, setUpper] = React.useState(true);
  const [lower, setLower] = React.useState(true);
  const [number, setNumber] = React.useState(true);
  const [symbol, setSymbol] = React.useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState("");

  const generate = React.useCallback(() => {
    let pool = "";
    if (upper) pool += SETS.upper;
    if (lower) pool += SETS.lower;
    if (number) pool += SETS.number;
    if (symbol) pool += SETS.symbol;
    if (excludeAmbiguous) pool = pool.replace(AMBIGUOUS, "");
    if (!pool) {
      setPassword("");
      setError("请至少选择一种字符集");
      return;
    }
    setError("");
    let result = "";
    for (let i = 0; i < length; i++) {
      result += pool[secureRandomInt(pool.length)];
    }
    setPassword(result);
  }, [length, upper, lower, number, symbol, excludeAmbiguous]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const copy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const score = strengthScore(
    password,
    [upper, lower, number, symbol].filter(Boolean).length * 26 || 1
  );

  const options = [
    { label: "大写字母 (A-Z)", checked: upper, set: setUpper },
    { label: "小写字母 (a-z)", checked: lower, set: setLower },
    { label: "数字 (0-9)", checked: number, set: setNumber },
    { label: "特殊符号", checked: symbol, set: setSymbol },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">生成的密码</CardTitle>
          <CardDescription>使用浏览器加密随机数生成</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              readOnly
              className="font-mono text-base"
              value={password}
              placeholder="点击生成密码..."
            />
            <Button onClick={copy} variant="outline" size="sm" disabled={!password}>
              <Copy className="mr-1 h-4 w-4" />
              {copied ? "已复制" : "复制"}
            </Button>
            <Button onClick={generate} size="sm">
              <RefreshCw className="mr-1 h-4 w-4" />
              生成
            </Button>
          </div>
          {error ? (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              ❌ {error}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 flex-1 rounded-full transition-colors",
                      i <= score ? strengthColors[score] : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                强度：{strengthLabels[score]}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">选项</CardTitle>
          <CardDescription>自定义密码长度与字符集</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">密码长度</label>
              <span className="font-mono text-sm font-semibold">{length}</span>
            </div>
            <input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => (
              <label
                key={opt.label}
                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={(e) => opt.set(e.target.checked)}
                  className="h-4 w-4"
                />
                {opt.label}
              </label>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="h-4 w-4"
            />
            排除易混淆字符 (I l 1 O 0 o)
          </label>
        </CardContent>
      </Card>
    </div>
  );
}

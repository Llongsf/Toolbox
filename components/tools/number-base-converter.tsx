"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Copy, Trash2 } from "lucide-react";

const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

function toBigInt(value: string, base: number): bigint {
  let s = value.trim();
  if (!s) throw new Error("空");
  let neg = false;
  if (s[0] === "-") {
    neg = true;
    s = s.slice(1);
  } else if (s[0] === "+") {
    s = s.slice(1);
  }
  if (base === 16 && /^0[xX]/.test(s)) s = s.slice(2);
  if (base === 2 && /^0[bB]/.test(s)) s = s.slice(2);
  if (base === 8 && /^0[oO]/.test(s)) s = s.slice(2);
  if (!s) throw new Error("空");
  let result = 0n;
  for (const ch of s.toLowerCase()) {
    const v = DIGITS.indexOf(ch);
    if (v < 0 || v >= base) throw new Error(`非法字符 "${ch}"`);
    result = result * BigInt(base) + BigInt(v);
  }
  return neg ? -result : result;
}

function fromBigInt(n: bigint, base: number): string {
  if (n === 0n) return "0";
  const neg = n < 0n;
  let v = neg ? -n : n;
  let out = "";
  while (v > 0n) {
    out = DIGITS[Number(v % BigInt(base))] + out;
    v = v / BigInt(base);
  }
  return neg ? "-" + out : out;
}

type BaseKey = "bin" | "oct" | "dec" | "hex";

export function NumberBaseConverter() {
  const [fields, setFields] = React.useState<Record<BaseKey, string>>({
    bin: "0",
    oct: "0",
    dec: "0",
    hex: "0",
  });
  const [errors, setErrors] = React.useState<Record<BaseKey, string>>({
    bin: "",
    oct: "",
    dec: "",
    hex: "",
  });

  const updateFrom = (key: BaseKey, base: number, value: string) => {
    if (!value.trim()) {
      setFields((prev) => ({ ...prev, [key]: "" }));
      setErrors((prev) => ({ ...prev, [key]: "" }));
      return;
    }
    try {
      const n = toBigInt(value, base);
      setFields({
        bin: key === "bin" ? value : fromBigInt(n, 2),
        oct: key === "oct" ? value : fromBigInt(n, 8),
        dec: key === "dec" ? value : fromBigInt(n, 10),
        hex: key === "hex" ? value : fromBigInt(n, 16),
      });
      setErrors({ bin: "", oct: "", dec: "", hex: "" });
    } catch (e: unknown) {
      setFields((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: (e as Error).message }));
    }
  };

  const clearAll = () => {
    setFields({ bin: "0", oct: "0", dec: "0", hex: "0" });
    setErrors({ bin: "", oct: "", dec: "", hex: "" });
  };

  const copy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  const rows: { key: BaseKey; base: number; label: string; prefix: string }[] = [
    { key: "bin", base: 2, label: "二进制", prefix: "0b" },
    { key: "oct", base: 8, label: "八进制", prefix: "0o" },
    { key: "dec", base: 10, label: "十进制", prefix: "" },
    { key: "hex", base: 16, label: "十六进制", prefix: "0x" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">进制转换</CardTitle>
              <CardDescription>
                编辑任意一项，其它进制自动更新（支持大数）
              </CardDescription>
            </div>
            <Button onClick={clearAll} variant="outline" size="sm">
              <Trash2 className="mr-1 h-4 w-4" />
              清空
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((row) => (
            <div key={row.key}>
              <label className="mb-1 block text-sm text-muted-foreground">
                {row.label}（基数 {row.base}）
              </label>
              <div className="flex gap-2">
                {row.prefix && (
                  <span className="flex items-center rounded-md border bg-muted px-3 font-mono text-sm text-muted-foreground">
                    {row.prefix}
                  </span>
                )}
                <Input
                  className="font-mono"
                  value={fields[row.key]}
                  onChange={(e) => updateFrom(row.key, row.base, e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 shrink-0"
                  disabled={!fields[row.key]}
                  onClick={() => copy(fields[row.key])}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {errors[row.key] && (
                <p className="mt-1 text-xs text-destructive">
                  ❌ {errors[row.key]}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

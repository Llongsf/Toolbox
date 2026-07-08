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
import { Copy } from "lucide-react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

function hexToRgb(hex: string): [number, number, number] | null {
  let h = hex.replace(/^#/, "").trim();
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function ColorConverter() {
  const [rgb, setRgb] = React.useState<[number, number, number]>([33, 96, 243]);
  const [hexInput, setHexInput] = React.useState("#2160f3");
  const [hexError, setHexError] = React.useState("");
  const [copied, setCopied] = React.useState("");

  const hex = rgbToHex(...rgb);
  const [h, s, l] = rgbToHsl(...rgb);

  const setChannel = (idx: number, val: number) => {
    const next = [...rgb] as [number, number, number];
    next[idx] = clamp(val, 0, 255);
    setRgb(next);
    setHexInput(rgbToHex(next[0], next[1], next[2]));
    setHexError("");
  };

  const onHexChange = (val: string) => {
    setHexInput(val);
    const parsed = hexToRgb(val);
    if (parsed) {
      setRgb(parsed);
      setHexError("");
    } else {
      setHexError("请输入合法的十六进制颜色，如 #1a2b3c 或 1a2b3c");
    }
  };

  const onPickerChange = (val: string) => {
    setHexInput(val);
    const parsed = hexToRgb(val);
    if (parsed) setRgb(parsed);
  };

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* ignore */
    }
  };

  const rows = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` },
    { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
  ];

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <Card className="flex flex-1 flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">颜色选择</CardTitle>
          <CardDescription>选择或输入颜色进行转换</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="h-32 w-full rounded-lg border"
            style={{ backgroundColor: hex }}
          />
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hex}
              onChange={(e) => onPickerChange(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border bg-background p-1"
            />
            <Input
              className="font-mono"
              value={hexInput}
              onChange={(e) => onHexChange(e.target.value)}
              placeholder="#1a2b3c"
            />
          </div>
          {hexError && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              ❌ {hexError}
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            {(["R", "G", "B"] as const).map((ch, i) => (
              <div key={ch}>
                <label className="text-xs text-muted-foreground">{ch}</label>
                <Input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[i]}
                  onChange={(e) => setChannel(i, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-1 flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">转换结果</CardTitle>
          <CardDescription>点击复制对应格式的值</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <div>
                <p className="text-xs text-muted-foreground">{row.label}</p>
                <p className="font-mono text-sm">{row.value}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => copy(row.label, row.value)}
              >
                {copied === row.label ? "已复制" : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          ))}
          <div className="rounded-md border px-3 py-2">
            <p className="text-xs text-muted-foreground">HSL 分量</p>
            <p className="font-mono text-sm">
              色相 {h}° / 饱和度 {s}% / 亮度 {l}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

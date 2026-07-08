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

function base64UrlDecode(str: string): string {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const decoded = decodeURIComponent(
    Array.from(atob(s), (c) =>
      "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
    ).join("")
  );
  return decoded;
}

function prettyJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

interface JwtParts {
  header: unknown;
  payload: unknown;
  signature: string;
}

function decodeJwt(token: string): JwtParts {
  const parts = token.trim().split(".");
  if (parts.length < 2) throw new Error("JWT 至少需要 header.payload 两部分");
  if (parts.length > 3) throw new Error("JWT 格式不正确，应为三段式");
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  const signature = parts[2] || "";
  return { header, payload, signature };
}

export function JwtDecoder() {
  const [token, setToken] = React.useState("");
  const [error, setError] = React.useState("");
  const [decoded, setDecoded] = React.useState<JwtParts | null>(null);

  const decode = () => {
    setError("");
    setDecoded(null);
    if (!token.trim()) {
      setError("请输入 JWT 令牌");
      return;
    }
    try {
      setDecoded(decodeJwt(token));
    } catch (e: unknown) {
      setError((e as Error).message || "解析失败");
    }
  };

  const clearAll = () => {
    setToken("");
    setDecoded(null);
    setError("");
  };

  const copy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  const payload = (decoded?.payload ?? {}) as Record<string, unknown>;
  const exp = typeof payload.exp === "number" ? payload.exp : null;
  const iat = typeof payload.iat === "number" ? payload.iat : null;
  const now = Math.floor(Date.now() / 1000);
  const expired = exp !== null ? now > exp : null;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">JWT 令牌</CardTitle>
          <CardDescription>粘贴 JWT，本地解码 Header 与 Payload</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            className="min-h-[120px] font-mono text-sm"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0In0..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={decode} size="sm">
              解析
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
      {decoded && (
        <>
          {exp !== null && (
            <div
              className={
                "rounded-md border px-4 py-3 text-sm " +
                (expired
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400")
              }
            >
              {expired ? "🔴 令牌已过期" : "🟢 令牌未过期"} · 过期时间：
              {new Date(exp * 1000).toLocaleString()}
              {iat !== null && (
                <span className="ml-2 text-muted-foreground">
                  · 签发于 {new Date(iat * 1000).toLocaleString()}
                </span>
              )}
            </div>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Header</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7"
                    onClick={() => copy(prettyJson(decoded.header))}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <CardDescription>令牌头部信息</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-auto rounded-md bg-muted p-4 font-mono text-sm">
                  {prettyJson(decoded.header)}
                </pre>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Payload</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7"
                    onClick={() => copy(prettyJson(decoded.payload))}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <CardDescription>令牌载荷信息</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-auto rounded-md bg-muted p-4 font-mono text-sm">
                  {prettyJson(decoded.payload)}
                </pre>
              </CardContent>
            </Card>
          </div>
          {decoded.signature && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Signature</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7"
                    onClick={() => copy(decoded.signature)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <CardDescription>签名（本地无法验证，需密钥）</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="break-all font-mono text-sm text-muted-foreground">
                  {decoded.signature}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

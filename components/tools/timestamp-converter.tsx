"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, RefreshCw } from "lucide-react";

export function TimestampConverter() {
  const [timestampInput, setTimestampInput] = React.useState("");
  const [timestampResult, setTimestampResult] = React.useState("");
  const [timestampError, setTimestampError] = React.useState("");
  const [datetimeInput, setDatetimeInput] = React.useState("");
  const [datetimeResult, setDatetimeResult] = React.useState("");
  const [datetimeError, setDatetimeError] = React.useState("");
  const [currentTimestamp, setCurrentTimestamp] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState("");

  // Real-time clock
  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTimestamp(now.getTime());
      setCurrentTime(formatDate(now));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const M = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    return `${y}-${M}-${d} ${h}:${m}:${s}`;
  };

  const handleTimestampConvert = () => {
    setTimestampError("");
    setTimestampResult("");
    if (!timestampInput.trim()) {
      setTimestampError("请输入时间戳");
      return;
    }
    const ts = Number(timestampInput);
    if (isNaN(ts)) {
      setTimestampError("无效的时间戳，请输入数字");
      return;
    }
    let date: Date;
    // Auto-detect seconds vs milliseconds
    if (ts > 1e12) {
      date = new Date(ts);
    } else {
      date = new Date(ts * 1000);
    }
    if (isNaN(date.getTime())) {
      setTimestampError("无效的时间戳");
      return;
    }
    setTimestampResult(formatDate(date));
  };

  const handleDatetimeConvert = () => {
    setDatetimeError("");
    setDatetimeResult("");
    if (!datetimeInput) {
      setDatetimeError("请选择日期时间");
      return;
    }
    const date = new Date(datetimeInput);
    if (isNaN(date.getTime())) {
      setDatetimeError("无效的日期时间");
      return;
    }
    const seconds = Math.floor(date.getTime() / 1000);
    const milliseconds = date.getTime();
    setDatetimeResult(`秒级时间戳: ${seconds}\n毫秒级时间戳: ${milliseconds}`);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const fillCurrentTimestamp = () => {
    const ts = Math.floor(Date.now() / 1000);
    setTimestampInput(String(ts));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Current Time Display */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">当前时间</CardTitle>
          <CardDescription>实时更新的当前时间和时间戳</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-lg bg-muted px-4 py-2">
              <p className="text-xs text-muted-foreground">本地时间</p>
              <p className="font-mono text-lg font-semibold">{currentTime}</p>
            </div>
            <div className="rounded-lg bg-muted px-4 py-2">
              <p className="text-xs text-muted-foreground">秒级时间戳</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-lg font-semibold">
                  {Math.floor(currentTimestamp / 1000)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyText(String(Math.floor(currentTimestamp / 1000)))}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="rounded-lg bg-muted px-4 py-2">
              <p className="text-xs text-muted-foreground">毫秒级时间戳</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-lg font-semibold">{currentTimestamp}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyText(String(currentTimestamp))}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Timestamp to Date */}
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">时间戳 → 日期时间</CardTitle>
                <CardDescription>输入时间戳，转换为可读时间</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fillCurrentTimestamp}>
                <RefreshCw className="mr-1 h-4 w-4" />
                当前时间
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
              placeholder="输入时间戳（秒或毫秒）"
              value={timestampInput}
              onChange={(e) => {
                setTimestampInput(e.target.value);
                setTimestampError("");
              }}
            />
            <Button onClick={handleTimestampConvert} size="sm">
              转换
            </Button>
            {timestampError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                ❌ {timestampError}
              </div>
            )}
            {timestampResult && (
              <div className="rounded-md bg-muted px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono font-semibold">{timestampResult}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => copyText(timestampResult)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Date to Timestamp */}
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">日期时间 → 时间戳</CardTitle>
            <CardDescription>选择日期时间，转换为时间戳</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="datetime-local"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={datetimeInput}
              onChange={(e) => {
                setDatetimeInput(e.target.value);
                setDatetimeError("");
              }}
            />
            <Button onClick={handleDatetimeConvert} size="sm">
              转换
            </Button>
            {datetimeError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                ❌ {datetimeError}
              </div>
            )}
            {datetimeResult && (
              <div className="rounded-md bg-muted px-4 py-3">
                <div className="flex items-center justify-between">
                  <pre className="font-mono text-sm font-semibold whitespace-pre-wrap">
                    {datetimeResult}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => copyText(datetimeResult)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
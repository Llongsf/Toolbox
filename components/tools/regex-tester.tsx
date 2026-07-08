"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";

interface MatchInfo {
  index: number;
  match: string;
  groups: string[];
}

const flagOptions = [
  { f: "g", label: "g 全局" },
  { f: "i", label: "i 忽略大小写" },
  { f: "m", label: "m 多行" },
  { f: "s", label: "s . 匹配换行" },
  { f: "u", label: "u Unicode" },
  { f: "y", label: "y 粘连" },
];

export function RegexTester() {
  const [pattern, setPattern] = React.useState("");
  const [flags, setFlags] = React.useState("g");
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState("");
  const [matches, setMatches] = React.useState<MatchInfo[]>([]);

  React.useEffect(() => {
    if (!pattern) {
      setError("");
      setMatches([]);
      return;
    }
    try {
      const re = new RegExp(pattern, flags);
      setError("");
      if (flags.includes("g")) {
        const found: MatchInfo[] = [];
        let m: RegExpExecArray | null;
        let guard = 0;
        while ((m = re.exec(text)) !== null) {
          found.push({
            index: m.index,
            match: m[0],
            groups: (m.slice(1) as (string | undefined)[]).map((g) => g ?? ""),
          });
          if (m[0] === "") re.lastIndex++;
          if (++guard > 10000) break;
        }
        setMatches(found);
      } else {
        const m = re.exec(text);
        setMatches(
          m
            ? [
                {
                  index: m.index,
                  match: m[0],
                  groups: (m.slice(1) as (string | undefined)[]).map((g) => g ?? ""),
                },
              ]
            : []
        );
      }
    } catch (e: unknown) {
      setError((e as Error).message);
      setMatches([]);
    }
  }, [pattern, flags, text]);

  const highlighted = React.useMemo(() => {
    if (matches.length === 0) return [{ text, type: "normal" as const }];
    const parts: { text: string; type: "normal" | "match" }[] = [];
    let last = 0;
    for (const m of matches) {
      if (m.index > last)
        parts.push({ text: text.slice(last, m.index), type: "normal" });
      parts.push({ text: m.match, type: "match" });
      last = m.index + m.match.length;
    }
    if (last < text.length)
      parts.push({ text: text.slice(last), type: "normal" });
    return parts;
  }, [matches, text]);

  const toggleFlag = (f: string) => {
    setFlags((prev) => (prev.includes(f) ? prev.replace(f, "") : prev + f));
  };

  const clearAll = () => {
    setPattern("");
    setText("");
    setError("");
    setMatches([]);
  };

  const copyMatches = async () => {
    const out = matches.map((m) => m.match).join("\n");
    if (!out) return;
    try {
      await navigator.clipboard.writeText(out);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">正则表达式</CardTitle>
          <CardDescription>输入正则与标志，实时匹配测试文本</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-muted-foreground">/</span>
            <Input
              className="flex-1 font-mono"
              placeholder="输入正则表达式，例如 \\d+"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            />
            <span className="font-mono text-muted-foreground">/{flags}</span>
            <Button onClick={clearAll} variant="outline" size="sm">
              <Trash2 className="mr-1 h-4 w-4" />
              清空
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {flagOptions.map((opt) => (
              <button
                key={opt.f}
                type="button"
                onClick={() => toggleFlag(opt.f)}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs transition-colors",
                  flags.includes(opt.f)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-accent"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">测试文本</CardTitle>
            <CardDescription>将被匹配的文本</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            <Textarea
              className="flex-1 min-h-[200px] font-mono text-sm"
              placeholder="输入测试文本..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-1 flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">匹配结果</CardTitle>
                <CardDescription>共 {matches.length} 处匹配</CardDescription>
              </div>
              <Button
                onClick={copyMatches}
                variant="outline"
                size="sm"
                disabled={matches.length === 0}
              >
                <Copy className="mr-1 h-4 w-4" />
                复制匹配项
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {error ? (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                ❌ {error}
              </div>
            ) : (
              <>
                <pre className="min-h-[80px] overflow-auto rounded-md bg-muted p-3 font-mono text-sm whitespace-pre-wrap break-words">
                  {highlighted.map((p, i) =>
                    p.type === "match" ? (
                      <mark
                        key={i}
                        className="rounded bg-yellow-300/60 px-0.5 dark:bg-yellow-500/40"
                      >
                        {p.text || " "}
                      </mark>
                    ) : (
                      <span key={i}>{p.text}</span>
                    )
                  )}
                  {!text && (
                    <span className="text-muted-foreground">
                      匹配高亮将显示在这里...
                    </span>
                  )}
                </pre>
                {matches.length > 0 && (
                  <div className="max-h-[200px] space-y-1 overflow-auto">
                    {matches.map((m, i) => (
                      <div
                        key={i}
                        className="rounded-md border px-3 py-1.5 text-xs"
                      >
                        <span className="text-muted-foreground">
                          #{i + 1} @ {m.index}
                        </span>
                        <span className="ml-2 font-mono">
                          {m.match || "(空匹配)"}
                        </span>
                        {m.groups.length > 0 && (
                          <div className="mt-1 text-muted-foreground">
                            捕获组:{" "}
                            {m.groups.map((g, gi) => (
                              <span key={gi} className="mr-2 font-mono">
                                [{gi + 1}]={g || "(空)"}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

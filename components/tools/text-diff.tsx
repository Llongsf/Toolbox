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
import { Copy, Trash2, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";

type DiffLine = { type: "equal" | "add" | "remove"; text: string };

function diffLines(a: string, b: string): DiffLine[] {
  const la = a.length ? a.split("\n") : [];
  const lb = b.length ? b.split("\n") : [];
  const n = la.length;
  const m = lb.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0)
  );
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] =
        la[i - 1] === lb[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const res: DiffLine[] = [];
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (la[i - 1] === lb[j - 1]) {
      res.push({ type: "equal", text: la[i - 1] });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      res.push({ type: "remove", text: la[i - 1] });
      i--;
    } else {
      res.push({ type: "add", text: lb[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    res.push({ type: "remove", text: la[i - 1] });
    i--;
  }
  while (j > 0) {
    res.push({ type: "add", text: lb[j - 1] });
    j--;
  }
  res.reverse();
  return res;
}

export function TextDiff() {
  const [left, setLeft] = React.useState("");
  const [right, setRight] = React.useState("");
  const [diff, setDiff] = React.useState<DiffLine[]>([]);

  const compute = () => {
    setDiff(diffLines(left, right));
  };

  const clearAll = () => {
    setLeft("");
    setRight("");
    setDiff([]);
  };

  const copyDiff = async () => {
    if (diff.length === 0) return;
    const text = diff
      .map((l) =>
        l.type === "add" ? `+ ${l.text}` : l.type === "remove" ? `- ${l.text}` : `  ${l.text}`
      )
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  const stats = {
    add: diff.filter((d) => d.type === "add").length,
    remove: diff.filter((d) => d.type === "remove").length,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">原始文本</CardTitle>
            <CardDescription>对比的左侧文本</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <Textarea
              className="flex-1 min-h-[240px] font-mono text-sm"
              placeholder="粘贴原始文本..."
              value={left}
              onChange={(e) => setLeft(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-1 flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">修改后文本</CardTitle>
            <CardDescription>对比的右侧文本</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <Textarea
              className="flex-1 min-h-[240px] font-mono text-sm"
              placeholder="粘贴修改后的文本..."
              value={right}
              onChange={(e) => setRight(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={compute} size="sm">
          <GitCompare className="mr-1 h-4 w-4" />
          对比差异
        </Button>
        <Button onClick={copyDiff} variant="outline" size="sm" disabled={diff.length === 0}>
          <Copy className="mr-1 h-4 w-4" />
          复制结果
        </Button>
        <Button onClick={clearAll} variant="outline" size="sm">
          <Trash2 className="mr-1 h-4 w-4" />
          清空
        </Button>
        {diff.length > 0 && (
          <span className="ml-auto self-center text-sm text-muted-foreground">
            <span className="text-green-600 dark:text-green-400">+{stats.add}</span>{" "}
            <span className="text-red-600 dark:text-red-400">-{stats.remove}</span>
          </span>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">差异结果</CardTitle>
          <CardDescription>绿色为新增行，红色为删除行</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-auto rounded-md border">
            {diff.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                点击「对比差异」查看结果...
              </p>
            ) : (
              diff.map((l, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-2 px-3 py-0.5 font-mono text-sm",
                    l.type === "add" &&
                      "bg-green-500/10 text-green-700 dark:text-green-400",
                    l.type === "remove" &&
                      "bg-red-500/10 text-red-700 dark:text-red-400",
                    l.type === "equal" && "text-foreground"
                  )}
                >
                  <span className="select-none text-muted-foreground">
                    {l.type === "add" ? "+" : l.type === "remove" ? "-" : " "}
                  </span>
                  <span className="whitespace-pre-wrap break-all">{l.text}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

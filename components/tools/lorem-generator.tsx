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
import { Copy, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " "
  );

function randInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function randomWord(): string {
  return WORDS[randInt(WORDS.length)];
}

function randomSentence(): string {
  const len = 5 + randInt(8);
  const words: string[] = [];
  for (let i = 0; i < len; i++) words.push(randomWord());
  let sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function randomParagraph(): string {
  const len = 3 + randInt(4);
  const sentences: string[] = [];
  for (let i = 0; i < len; i++) sentences.push(randomSentence());
  return sentences.join(" ");
}

type Unit = "paragraph" | "sentence" | "word";

export function LoremGenerator() {
  const [count, setCount] = React.useState(3);
  const [unit, setUnit] = React.useState<Unit>("paragraph");
  const [startClassic, setStartClassic] = React.useState(true);
  const [output, setOutput] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const generate = () => {
    const n = Math.max(1, Math.min(100, count || 1));
    const parts: string[] = [];
    if (unit === "paragraph") {
      for (let i = 0; i < n; i++) parts.push(randomParagraph());
      if (startClassic) {
        parts[0] =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
          parts[0];
      }
      setOutput(parts.join("\n\n"));
    } else if (unit === "sentence") {
      for (let i = 0; i < n; i++) parts.push(randomSentence());
      setOutput(parts.join(" "));
    } else {
      for (let i = 0; i < n; i++) parts.push(randomWord());
      setOutput(parts.join(" "));
    }
  };

  React.useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const units: { key: Unit; label: string }[] = [
    { key: "paragraph", label: "段落" },
    { key: "sentence", label: "句子" },
    { key: "word", label: "单词" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">生成选项</CardTitle>
          <CardDescription>生成占位文本（Lorem Ipsum）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
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
            <div className="flex rounded-md border overflow-hidden w-fit">
              {units.map((u) => (
                <button
                  key={u.key}
                  type="button"
                  onClick={() => setUnit(u.key)}
                  className={cn(
                    "px-4 py-1.5 text-sm transition-colors",
                    unit === u.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent"
                  )}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
          {unit === "paragraph" && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={startClassic}
                onChange={(e) => setStartClassic(e.target.checked)}
                className="h-4 w-4"
              />
              首段以经典 &quot;Lorem ipsum...&quot; 开头
            </label>
          )}
          <div className="flex gap-2">
            <Button onClick={generate} size="sm">
              <RefreshCw className="mr-1 h-4 w-4" />
              生成
            </Button>
            <Button onClick={() => setOutput("")} variant="outline" size="sm">
              <Trash2 className="mr-1 h-4 w-4" />
              清空
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">结果</CardTitle>
            <Button onClick={copy} variant="outline" size="sm" disabled={!output}>
              <Copy className="mr-1 h-4 w-4" />
              {copied ? "已复制" : "复制"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="min-h-[200px] overflow-auto rounded-md bg-muted p-4 font-mono text-sm whitespace-pre-wrap">
            {output || (
              <span className="text-muted-foreground">结果将显示在这里...</span>
            )}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

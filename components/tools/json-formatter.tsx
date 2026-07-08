"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Trash2, Minimize2, AlignLeft } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function JsonFormatter() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState("");
  const { t } = useI18n();

  const formatJson = () => {
    setError("");
    if (!input.trim()) {
      setError(t("json.error_empty"));
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message);
      setOutput("");
    }
  };

  const compressJson = () => {
    setError("");
    if (!input.trim()) {
      setError(t("json.error_empty"));
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message);
      setOutput("");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = output;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      {/* Input */}
      <Card className="flex flex-1 flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("json.input")}</CardTitle>
          <CardDescription>{t("json.input.desc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <Textarea
            className="flex-1 min-h-[300px] font-mono text-sm"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={formatJson} size="sm">
              <AlignLeft className="mr-1 h-4 w-4" />
              {t("json.format")}
            </Button>
            <Button onClick={compressJson} variant="secondary" size="sm">
              <Minimize2 className="mr-1 h-4 w-4" />
              {t("json.compress")}
            </Button>
            <Button onClick={clearAll} variant="outline" size="sm">
              <Trash2 className="mr-1 h-4 w-4" />
              {t("json.clear")}
            </Button>
          </div>
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              ❌ {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Output */}
      <Card className="flex flex-1 flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{t("json.output")}</CardTitle>
              <CardDescription>{t("json.output.desc")}</CardDescription>
            </div>
            <Button onClick={copyOutput} variant="outline" size="sm" disabled={!output}>
              <Copy className="mr-1 h-4 w-4" />
              {t("json.copy")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <pre className="h-full min-h-[300px] overflow-auto rounded-md bg-muted p-4 font-mono text-sm">
            {output || (
              <span className="text-muted-foreground">{t("json.placeholder")}</span>
            )}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="mt-2 text-muted-foreground">{t("not_found.title")}</p>
      <Link
        href="/"
        className="mt-4 text-primary underline underline-offset-4 hover:text-primary/80"
      >
        {t("not_found.back")}
      </Link>
    </div>
  );
}
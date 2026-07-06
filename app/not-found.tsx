import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="mt-2 text-muted-foreground">页面未找到</p>
      <Link
        href="/"
        className="mt-4 text-primary underline underline-offset-4 hover:text-primary/80"
      >
        返回首页
      </Link>
    </div>
  );
}
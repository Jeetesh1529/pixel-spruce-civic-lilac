import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";

export function AuthChip({ light = false }: { light?: boolean }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-9 w-24 animate-pulse bg-paper/10" />;
  }
  if (!user) {
    return (
      <Link
        to="/login"
        className={cn(
          "inline-flex h-9 items-center px-4 text-sm font-semibold tracking-wide uppercase",
          light ? "border border-paper/30 text-paper hover:border-brand hover:text-brand" : "bg-brand text-ink hover:bg-paper",
        )}
      >
        Sign in
      </Link>
    );
  }
  return (
    <div className={cn("text-paper", light && "[&_span]:text-paper [&_button]:text-brand")}>
      <UserButton />
    </div>
  );
}

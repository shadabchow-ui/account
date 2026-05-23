import Image from "next/image";
import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Upcube Account home"
      className="inline-flex items-center gap-3 text-inherit"
    >
      <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[1.1rem] border border-[var(--account-border)] bg-black shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
        <Image
          src="/brand/logo.png"
          alt="Upcube"
          width={44}
          height={44}
          priority
          className="h-full w-full object-cover"
        />
      </span>
      {!compact ? (
        <span className="min-w-0">
          <span className="block text-sm font-semibold tracking-[0.02em] text-[var(--account-text)]">
            Upcube
          </span>
          <span className="block text-xs text-[var(--account-muted)]">
            Account
          </span>
        </span>
      ) : null}
    </Link>
  );
}

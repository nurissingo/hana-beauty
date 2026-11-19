"use client";

import Link, { useLinkStatus } from "next/link";
import type { ReactNode } from "react";

function PendingCue({ children }: { children: ReactNode }) {
  const { pending } = useLinkStatus();
  return <span className={`admin-link-inner ${pending ? "is-pending" : ""}`}>{children}</span>;
}

export function AdminNavLink({
  href,
  className,
  children,
  onNavigate,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link href={href} prefetch className={className} onClick={onNavigate}>
      <PendingCue>{children}</PendingCue>
    </Link>
  );
}

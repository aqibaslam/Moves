'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Client component purely so it can read the active path. Kept as a leaf so
 * the surrounding shell stays a Server Component.
 */
export function NavLink({
  href,
  label,
  children,
}: {
  href: Route;
  label: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Exact match for the index, prefix match for sections — so /dashboard does
  // not stay highlighted while you are on /dashboard/orders.
  const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <Link className="dash__navlink" href={href} aria-current={active ? 'page' : undefined}>
      {children}
      {label}
    </Link>
  );
}

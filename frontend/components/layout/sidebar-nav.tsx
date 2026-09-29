"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { navGroups } from "@/components/layout/nav-items";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { hasRole } = useAuth();

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto p-4">
      {navGroups.map((group, i) => {
        const items = group.items.filter(
          (item) => !item.roles || hasRole(...item.roles)
        );
        if (items.length === 0) return null;

        return (
          <div key={i} className="space-y-1">
            {group.title && (
              <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {group.title}
              </p>
            )}
            {items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
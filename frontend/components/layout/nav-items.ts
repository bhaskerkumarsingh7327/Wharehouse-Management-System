import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  ClipboardCheck,
  History,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: Role[]; // khali ho to sabko dikhega
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Products", href: "/products", icon: Package },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Receipts", href: "/receipts", icon: ArrowDownToLine },
      { label: "Delivery Orders", href: "/deliveries", icon: ArrowUpFromLine },
      { label: "Internal Transfers", href: "/transfers", icon: ArrowLeftRight },
      { label: "Inventory Adjustments", href: "/adjustments", icon: ClipboardCheck },
      { label: "Move History", href: "/ledger", icon: History },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Warehouses", href: "/warehouses", icon: Warehouse },
    ],
  },
];
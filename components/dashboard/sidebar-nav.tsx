"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  UsersIcon,
  Building2Icon,
  HandshakeIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersRoundIcon,
  LogOutIcon,
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    icon: <LayoutDashboardIcon className="w-4 h-4" />,
    href: "/dashboard",
  },
  {
    title: "Contacts",
    icon: <UsersIcon className="w-4 h-4" />,
    href: "/dashboard/contacts",
  },
  {
    title: "Organizations",
    icon: <Building2Icon className="w-4 h-4" />,
    href: "/dashboard/organizations",
  },
  {
    title: "Deals",
    icon: <HandshakeIcon className="w-4 h-4" />,
    href: "/dashboard/deals",
  },
  {
    title: "Activities",
    icon: <HistoryIcon className="w-4 h-4" />,
    href: "/dashboard/activities",
  },
  {
    title: "Team",
    icon: <UsersRoundIcon className="w-4 h-4" />,
    href: "/dashboard/team",
  },
  {
    title: "Settings",
    icon: <SettingsIcon className="w-4 h-4" />,
    href: "/dashboard/settings",
  },
];

export default function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-2 p-4 pt-6">
      {navItems.map((nav) => (
        <Link
          key={nav.href}
          href={nav.href}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded group font-medium transition-colors",
            pathname.startsWith(nav.href)
              ? "bg-primary/10 text-primary shadow-sm"
              : "hover:bg-muted"
          )}
        >
          {nav.icon}
          <span>{nav.title}</span>
        </Link>
      ))}
      {/* Sign Out handled in header, do not duplicate here */}
    </nav>
  );
}
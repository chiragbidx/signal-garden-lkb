"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="w-full border-b bg-background/70 backdrop-blur py-2 px-6 flex items-center justify-between z-40 relative">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <img alt="PulseCRM Logo" src="/favicon.ico" className="w-7 h-7 rounded-sm" />
          <span className="font-extrabold text-xl tracking-tight text-primary">PulseCRM</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {/* Navigation logic can expand here as needed */}
        <Button asChild variant={pathname === "/auth" ? "secondary" : "outline"}>
          <Link href="/auth">{pathname === "/auth" ? "Sign In" : "Log in"}</Link>
        </Button>
        <ModeToggle />
      </div>
    </nav>
  );
}
// components/PageShell.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/survey", label: "Student Survey" },
  { href: "/demo", label: "Company Demo" },
  { href: "/admin", label: "Admin" },
];

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top nav */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo + wordmark */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
              <Image
                src="/Images/Signl.png"
                alt="Signl logo"
                fill
                sizes="32px"
                className="object-contain p-1.5"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-50">
                Signl
              </span>
              <span className="text-[11px] text-slate-400">
                Peer validated talent
              </span>
            </div>
          </Link>

          {/* Nav items */}
          <nav className="flex items-center gap-1 text-sm">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    "inline-flex items-center rounded-full border px-3 py-1.5 font-medium transition",
                    active
                      ? "border-sky-400 bg-sky-500/10 text-sky-100"
                      : "border-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Members List", href: "/about/members" },
      { label: "Executive Committee", href: "/about/executive-committee" },
      { label: "Constitution & Bylaws", href: "/about/constitution" },
      { label: "Elections", href: "/about/elections" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Price Lists", href: "/resources/price-lists" },
      { label: "GEMA Diary", href: "/resources/gema-diary" },
      { label: "Circulars", href: "/resources/circulars" },
    ],
  },
  {
    label: "Events",
    href: "/events",
    children: [
      { label: "Exhibitions", href: "/events/exhibitions" },
      { label: "Social Activities", href: "/events/social" },
    ],
  },
  { label: "Membership", href: "/membership" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white border-b-2 border-[var(--gold)] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="GEMA Logo"
              width={64}
              height={64}
              className="w-14 h-14"
            />
            <div>
              <span className="font-bold text-lg text-[var(--primary)]">
                GEMA
              </span>
              <span className="hidden sm:block text-xs text-[var(--gray-600)]">
                Guwahati Electrical Merchants Association
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() =>
                  item.children && setOpenDropdown(item.label)
                }
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <span
                    className="px-3 py-2 text-sm font-semibold text-[var(--gray-800)] hover:text-[var(--primary)] transition-colors rounded-md hover:bg-red-50 flex items-center gap-1 cursor-default select-none"
                  >
                    {item.label}
                    <svg
                      className="w-3.5 h-3.5 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm font-semibold text-[var(--gray-800)] hover:text-[var(--primary)] transition-colors rounded-md hover:bg-red-50 flex items-center gap-1"
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-[var(--gray-800)] hover:bg-red-50 hover:text-[var(--primary)] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-[var(--gray-800)] hover:bg-red-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <span className="block px-3 py-2 text-sm font-semibold text-[var(--gray-800)] cursor-default select-none">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-sm font-semibold text-[var(--gray-800)] hover:text-[var(--primary)] rounded-md hover:bg-red-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
                {item.children && (
                  <div className="pl-6 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-1.5 text-sm text-[var(--gray-600)] hover:text-[var(--primary)]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

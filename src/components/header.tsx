"use client";

import { icons } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

export function Header() {
  const IconComponent = icons[siteConfig.headerIcon as keyof typeof icons];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 max-w-screen-xl items-center justify-between px-4 mx-auto">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand to-brand-accent rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-background rounded-lg p-1.5">
              {IconComponent && <IconComponent className="h-5 w-5 text-brand" />}
            </div>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}

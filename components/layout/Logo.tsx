"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoVariant = "icon" | "colored" | "neutral";
type LogoProps = {
  variant?: LogoVariant;
  width?: number;
  height?: number;
  className?: string;
};

const logoSources = {
  icon: {
    light: "/logo-icon-dark.png",
    dark: "/logo-icon-primary.png",
  },
  colored: {
    light: "/logo-primary-dark.png",
    dark: "/logo-primary.png",
  },
  neutral: {
    light: "/logo-neutral-dark.png",
    dark: "/logo-neutral.png",
  },
} as const;

const defaultSizes = {
  icon: { width: 32, height: 32 },
  colored: { width: 120, height: 32 },
  neutral: { width: 120, height: 32 },
} as const;

export function Logo({ 
  variant = "colored", 
  width, 
  height, 
  className 
}: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Get the appropriate logo source based on variant and theme
  const logoSource = logoSources[variant][isDark ? "dark" : "light"];
  
  // Use provided dimensions or fall back to defaults for the variant
  const dimensions = {
    width: width ?? defaultSizes[variant].width,
    height: height ?? defaultSizes[variant].height,
  };

  return (
    <div className={cn("relative", className)}>
      <Image
        src={logoSource}
        alt="StayScore Logo"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain"
        priority // Add priority since logo is likely above the fold
      />
    </div>
  );
}

// Optional: Export a more specific version for each variant
export function IconLogo(props: Omit<LogoProps, "variant">) {
  return <Logo variant="icon" {...props} />;
}

export function ColoredLogo(props: Omit<LogoProps, "variant">) {
  return <Logo variant="colored" {...props} />;
}

export function NeutralLogo(props: Omit<LogoProps, "variant">) {
  return <Logo variant="neutral" {...props} />;
}
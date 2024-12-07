"use client"

import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoaderProps {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16'
} as const;

export default function Loader({ 
  fullPage = false, 
  size = 'md',
  className 
}: LoaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerClasses = cn(
    'flex items-center justify-center',
    fullPage ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50' : 'relative',
    className
  );

  const spinAnimation = {
    animate: {
      rotate: 360,
      scale: [1, 1.1, 1],
    },
    transition: {
      rotate: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      },
      scale: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={containerClasses}>
      <motion.img
        src={isDark ? "/logo-icon-primary.png" : "/logo-icon-dark.png"}
        alt="Loading..."
        className={cn(
          'object-contain',
          sizeMap[size]
        )}
        {...spinAnimation}
      />
    </div>
  );
}
'use client';

import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingMap = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

export function Card({ children, className = '', padding = 'lg' }: CardProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/5 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

interface GradientCardProps {
  children: ReactNode;
  className?: string;
}

export function GradientCard({ children, className = '' }: GradientCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-gradient-to-br from-violet-500/25 via-indigo-500/10 to-white/5 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

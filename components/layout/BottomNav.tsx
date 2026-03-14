'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  emoji: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', emoji: '🏠' },
  { label: 'Transactions', href: '/transactions', emoji: '💳' },
  { label: 'Add', href: '/add', emoji: '➕' },
  { label: 'Budget', href: '/budget', emoji: '📊' },
  { label: 'Compare', href: '/compare', emoji: '🔄' },
];

function BottomNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-2 text-xs font-medium transition ${
        isActive
          ? 'bg-violet-500/20 text-white'
          : 'text-white/50 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className="text-base">{item.emoji}</span>
      <span>{item.label}</span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-md items-center gap-1 rounded-[28px] border border-white/10 bg-black/60 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {NAV_ITEMS.map((item) => (
          <BottomNavItem
            key={item.href}
            item={item}
            isActive={
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)
            }
          />
        ))}
      </div>
    </nav>
  );
}

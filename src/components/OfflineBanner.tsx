import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-center gap-2 text-amber-800 dark:text-amber-200 text-xs font-medium animate-fadeIn">
      <WifiOff className="w-4 h-4 text-amber-500 flex-shrink-0 animate-pulse" />
      <span>
        <strong>Offline Mode Active</strong> — Showing verified local hospital directory & emergency contacts.
      </span>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { MobileLayout } from './MobileLayout';
import { DesktopLayout } from './DesktopLayout';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  unreadNotifications?: number;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

export function ResponsiveLayout({ children, unreadNotifications = 0, user }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <MobileLayout unreadNotifications={unreadNotifications}>
        {children}
      </MobileLayout>
    );
  }

  return (
    <DesktopLayout unreadNotifications={unreadNotifications} user={user}>
      {children}
    </DesktopLayout>
  );
}
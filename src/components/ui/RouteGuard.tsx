'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = [
  '/',
  '/signup',
  '/reset',
  '/verify'
];

const SHARED_NOTE_PATTERN = /^\/shared\/.+$/;

function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.includes(path) || SHARED_NOTE_PATTERN.test(path);
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthReady, isAuthenticated, openIDMWindow } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthReady) return;

    const publicRoute = isPublicRoute(pathname);
    
    // Protected route check
    if (!isAuthenticated && !publicRoute) {
      openIDMWindow();
      return;
    }

    // Landing to Notes redirect
    if (isAuthenticated && pathname === '/') {
      router.replace('/notes');
    }
  }, [isAuthReady, isAuthenticated, pathname, router, openIDMWindow]);

  return <>{children}</>;
};

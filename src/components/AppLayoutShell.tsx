"use client";

import React from 'react';
import AppLayoutContent from '@/app/(app)/AppLayoutContent';
import { SidebarProvider } from '@/components/ui/SidebarContext';
import { DynamicSidebarProvider } from '@/components/ui/DynamicSidebar';

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DynamicSidebarProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </DynamicSidebarProvider>
    </SidebarProvider>
  );
}

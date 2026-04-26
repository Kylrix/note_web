"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/ui/AuthContext';
import { GhostEditor } from '@/components/landing/GhostEditor';
import { Box } from '@mui/material';
import { DynamicSidebarProvider, DynamicSidebar } from '@/components/ui/DynamicSidebar';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/notes');
    }
  }, [isAuthenticated, router]);

  return (
    <DynamicSidebarProvider>
      <Box sx={{
        minHeight: '100vh',
        bgcolor: '#000',
        color: 'rgba(255, 255, 255, 0.9)',
      }}>
        <GhostEditor />
      </Box>
      <DynamicSidebar />
    </DynamicSidebarProvider>
  );
}

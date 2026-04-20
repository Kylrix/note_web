"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getNote, updateNote, deleteNote } from '@/lib/appwrite';
import type { Notes } from '@/types/appwrite';
import { NoteDetailSidebar } from '@/components/ui/NoteDetailSidebar';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  CircularProgress, 
  Container, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  useTheme, 
  useMediaQuery,
  alpha
} from '@mui/material';
import { 
  Delete as TrashIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useToast } from '@/components/ui/Toast';
import CommentsSection from '@/app/(app)/notes/Comments';
import NoteReactions from '@/app/(app)/notes/NoteReactions';
import SudoGuard from '@/components/ui/SudoGuard';
import { useDataNexus } from '@/context/DataNexusContext';

const NOTE_HOFF_PREFIX = 'note_detail_handoff_';
const NOTE_HOFF_TTL = 60_000;
const VOID = '#000000';
const SURFACE = '#0A0908';
const BORDER = 'rgba(255, 255, 255, 0.08)';

type NoteHandoff = {
  note: Notes;
  openedAt: number;
};

function readNoteHandoff(noteId: string): Notes | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(`${NOTE_HOFF_PREFIX}${noteId}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as NoteHandoff;
    if (
      !parsed ||
      parsed.note?.$id !== noteId ||
      typeof parsed.openedAt !== 'number' ||
      Date.now() - parsed.openedAt > NOTE_HOFF_TTL
    ) {
      window.sessionStorage.removeItem(`${NOTE_HOFF_PREFIX}${noteId}`);
      return null;
    }

    return parsed.note;
  } catch {
    return null;
  }
}

function clearNoteHandoff(noteId: string) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(`${NOTE_HOFF_PREFIX}${noteId}`);
}

export default function NoteEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const mountedRef = useRef(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { showSuccess, showError } = useToast();
  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('md'));
  const { fetchOptimized, setCachedData, invalidate, getCachedData } = useDataNexus();

  const CACHE_KEY = useMemo(() => id ? `note_${id}` : null, [id]);
  const cachedNote = useMemo(() => {
    if (!id || !CACHE_KEY) return null;
    return readNoteHandoff(String(id)) || getCachedData<Notes>(CACHE_KEY);
  }, [id, CACHE_KEY, getCachedData]);
  const [note, setNote] = useState<Notes | null>(() => cachedNote);
  const [isLoading, setIsLoading] = useState(() => !cachedNote);

  useEffect(() => {
    mountedRef.current = true;

    if (!id || !CACHE_KEY) {
      setNote(null);
      setIsLoading(false);
      return;
    }

    if (cachedNote) {
      setNote(cachedNote);
      setCachedData(CACHE_KEY, cachedNote);
      clearNoteHandoff(String(id));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    (async () => {
      try {
        const fetched = await fetchOptimized(CACHE_KEY, () => getNote(id as string));
        if (mountedRef.current) {
          setNote(fetched);
          setCachedData(CACHE_KEY, fetched);
        }
      } catch (error: any) {
        console.error('Failed to load note', error);
        showError('Failed to load note', 'Please try again later.');
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, [id, CACHE_KEY, cachedNote, showError, fetchOptimized, setCachedData]);

  const handleUpdate = async (updated: Notes) => {
    try {
      const saved = await updateNote(updated.$id || (id as string) || '', updated);
      setNote(saved);
      // Update cache
      if (CACHE_KEY) setCachedData(CACHE_KEY, saved);
      showSuccess('Saved', 'Note updated successfully');
    } catch (error: any) {
      console.error('Update failed', error);
      showError('Update failed', 'Could not save your changes.');
    }
  };

  const handleDelete = async (noteId: string) => {
    setIsDeleting(true);
    try {
      await deleteNote(noteId);
      // Invalidate cache
      if (CACHE_KEY) invalidate(CACHE_KEY);
      showSuccess('Deleted', 'Note removed');
      router.push('/notes');
    } catch (error: any) {
      console.error('Delete failed', error);
      showError('Delete failed', 'Could not delete the note.');
    } finally {
      setIsDeleting(false);
    }
  };

  const title = useMemo(() => note?.title || 'Untitled note', [note]);

  const handleMinimize = () => {
    if (!note?.$id) return;
    const target = isMobileViewport ? '/notes' : `/notes?openNoteId=${note.$id}`;
    router.push(target);
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: VOID }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!note) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: VOID }}>
        <Typography color="text.secondary">Note not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: VOID }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: 2, 
          bgcolor: SURFACE,
          borderRadius: '32px',
          border: `1px solid ${BORDER}`,
          p: 4,
          mb: 6,
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconButton
              onClick={handleMinimize}
              disabled={isDeleting}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                p: 1.5,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  transform: 'translateX(-4px)'
                }
              }}
            >
              <BackIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <Box>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 900, 
                  letterSpacing: '-0.04em',
                  fontFamily: 'var(--font-clash-display)',
                  lineHeight: 1,
                  mb: 0.5
                }}
              >
                {title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Note Editor
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<TrashIcon />}
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              sx={{ 
                borderRadius: '14px',
                px: 3,
                py: 1.2,
                fontWeight: 800,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: 'error.main',
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.2),
                  borderColor: 'error.main',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        </Box>
        
        <Box component="main" sx={{ 
          perspective: '1200px',
          '& > *': {
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }
        }}>
          <SudoGuard>
            <NoteDetailSidebar
              note={note}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              showExpandButton={false}
              showHeaderDeleteButton={false}
            />
          </SudoGuard>
        </Box>

        <Box sx={{ 
          mt: 8, 
          pt: 6, 
          borderTop: `1px solid ${BORDER}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          <Box sx={{ 
            p: 4, 
            bgcolor: SURFACE,
            borderRadius: '32px',
            border: `1px solid ${BORDER}`,
          }}>
            <NoteReactions targetId={id as string} />
          </Box>
          
          <Box sx={{ 
            p: 4, 
            bgcolor: SURFACE,
            borderRadius: '32px',
            border: `1px solid ${BORDER}`,
          }}>
            <CommentsSection noteId={id as string} />
          </Box>
        </Box>
      </Container>

      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        PaperProps={{
          sx: {
            borderRadius: 6,
            bgcolor: VOID,
            border: `1px solid ${BORDER}`,
            backgroundImage: 'none',
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem' }}>Confirm delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Deleting this note is permanent. Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            variant="contained" 
            color="error"
            fullWidth
            onClick={() => {
              handleDelete(note.$id);
              setShowDeleteConfirm(false);
            }}
            disabled={isDeleting}
            sx={{ borderRadius: 3 }}
          >
            Delete note
          </Button>
          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => setShowDeleteConfirm(false)}
            sx={{ 
              borderRadius: 3,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'text.primary'
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

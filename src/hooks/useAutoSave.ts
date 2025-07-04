import { useEffect, useRef, useCallback } from 'react';

interface UseAutoSaveProps {
  data: any;
  onSave: (data: any) => void;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({ 
  data, 
  onSave, 
  delay = 2000, 
  enabled = true 
}: UseAutoSaveProps) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');
  const isInitialRender = useRef(true);

  const debouncedSave = useCallback(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);
    
    // Don't save on initial render or if data hasn't changed
    if (isInitialRender.current || currentData === lastSavedRef.current) {
      isInitialRender.current = false;
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onSave(data);
      lastSavedRef.current = currentData;
    }, delay);
  }, [data, onSave, delay, enabled]);

  useEffect(() => {
    debouncedSave();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debouncedSave]);

  // Force save immediately
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const currentData = JSON.stringify(data);
    if (currentData !== lastSavedRef.current) {
      onSave(data);
      lastSavedRef.current = currentData;
    }
  }, [data, onSave]);

  return { forceSave };
};
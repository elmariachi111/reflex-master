"use client";

// This file was created while vibing the dialog application and is not used at the moment.
import { DialogMessage, SessionDialogManager } from '../utils/sessionDialog';
import { useCallback, useRef, useState } from 'react';

interface UseSessionDialogOptions {
  scope?: string[];
  width?: number;
  height?: number;
  onReady?: () => void;
  onMessage?: (message: DialogMessage) => void;
  onClose?: () => void;
}

export function useSessionDialog(options: UseSessionDialogOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const managerRef = useRef<SessionDialogManager | null>(null);

  const openDialog = useCallback(async () => {
    if (isLoading || isOpen) return;

    setIsLoading(true);
    try {
      const manager = new SessionDialogManager({
        ...options,
        onReady: () => {
          setIsOpen(true);
          setIsLoading(false);
          options.onReady?.();
        },
        onClose: () => {
          setIsOpen(false);
          setIsLoading(false);
          managerRef.current = null;
          options.onClose?.();
        },
        onMessage: options.onMessage,
      });

      await manager.open();
      managerRef.current = manager;
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to open session dialog:', error);
      throw error;
    }
  }, [isLoading, isOpen, options]);

  const closeDialog = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.close();
      managerRef.current = null;
    }
    setIsOpen(false);
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback(async (message: DialogMessage) => {
    if (!managerRef.current) {
      throw new Error('Dialog is not open');
    }
    return managerRef.current.sendMessage(message);
  }, []);

  const setScope = useCallback(async (scope: string[]) => {
    if (!managerRef.current) {
      throw new Error('Dialog is not open');
    }
    return managerRef.current.setScope(scope);
  }, []);

  const ping = useCallback(async () => {
    if (!managerRef.current) {
      throw new Error('Dialog is not open');
    }
    return managerRef.current.ping();
  }, []);

  return {
    isOpen,
    isLoading,
    openDialog,
    closeDialog,
    sendMessage,
    setScope,
    ping,
  };
} 
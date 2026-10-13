import { useEffect, useState, useCallback, useRef } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePWAStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [isOfflineReady, setIsOfflineReady] = useState<boolean>(false);
  const [needRefresh, setNeedRefresh] = useState<boolean>(false);
  const [swSupported, setSwSupported] = useState<boolean>(true);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [storageEstimate, setStorageEstimate] = useState<{
    usageMb: number;
    quotaMb: number;
  } | null>(null);

  const updateSWRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  // Storage Quota checking
  const checkStorage = useCallback(async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const { usage, quota } = await navigator.storage.estimate();
        const usageMb = Math.round(((usage || 0) / (1024 * 1024)) * 10) / 10;
        const quotaMb = Math.round(((quota || 0) / (1024 * 1024)) * 10) / 10;
        setStorageEstimate({ usageMb, quotaMb });

        // Warning if storage is critically low (under 10MB free)
        if (quota && usage && quota - usage < 10 * 1024 * 1024) {
          setStorageWarning('Құрылғыңызда офлайн кэш үшін бос жад көлемі өте аз.');
        } else {
          setStorageWarning(null);
        }
      } catch {
        // Storage estimate restricted in some sandbox iframes
      }
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      setSwSupported(true);

      try {
        const updateSW = registerSW({
          immediate: true,
          onNeedRefresh() {
            setNeedRefresh(true);
          },
          onOfflineReady() {
            setIsOfflineReady(true);
            checkStorage();
          },
          onRegisteredSW() {
            checkStorage();
          },
          onRegisterError(error) {
            console.warn('PWA ServiceWorker registration notice:', error);
          },
        });

        updateSWRef.current = updateSW;
      } catch (err) {
        console.warn('PWA virtual register fallback:', err);
      }

      // Also listen to controller change
      if (navigator.serviceWorker.controller) {
        setIsOfflineReady(true);
      }

      navigator.serviceWorker.ready
        .then(() => {
          setIsOfflineReady(true);
          checkStorage();
        })
        .catch(() => {
          // Iframe restrictions
        });
    } else {
      setSwSupported(false);
    }

    checkStorage();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkStorage]);

  const updateApp = useCallback(() => {
    if (updateSWRef.current) {
      updateSWRef.current(true);
    } else if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        } else {
          window.location.reload();
        }
      });
    } else {
      window.location.reload();
    }
  }, []);

  return {
    isOnline,
    isOfflineReady,
    needRefresh,
    swSupported,
    storageWarning,
    storageEstimate,
    updateApp,
  };
}

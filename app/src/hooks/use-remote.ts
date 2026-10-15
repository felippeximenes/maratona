import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '@/lib/api';
import { readCache, writeCache } from '@/lib/cache';

type RemoteState<T> = {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  /** Sem internet, mostrando o último conteúdo guardado. */
  isOffline: boolean;
};

/**
 * Carrega o conteúdo de uma tela. Sem internet, cai na última cópia guardada
 * no aparelho; sem cópia, devolve o erro para a tela oferecer "Tentar de novo".
 */
export function useRemote<T>(cacheKey: string, fetcher: () => Promise<T>) {
  const [state, setState] = useState<RemoteState<T>>({
    data: null,
    error: null,
    isLoading: true,
    isOffline: false,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    fetcher()
      .then((data) => {
        if (!active) return;
        setState({ data, error: null, isLoading: false, isOffline: false });
        writeCache(cacheKey, data);
      })
      .catch(async (error: unknown) => {
        const apiError = error instanceof ApiError ? error : new ApiError('server');
        const cached = apiError.kind === 'offline' ? await readCache<T>(cacheKey) : null;
        if (!active) return;
        setState(
          cached
            ? { data: cached, error: null, isLoading: false, isOffline: true }
            : { data: null, error: apiError, isLoading: false, isOffline: false },
        );
      });

    return () => {
      active = false;
    };
    // fetcher muda a cada render; a chave identifica o conteúdo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, attempt]);

  const retry = useCallback(() => {
    setState((s) => ({ ...s, error: null, isLoading: true }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}

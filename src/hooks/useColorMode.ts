import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type ColorMode = 'light' | 'dark';

export function useColorMode() {
  const [colorMode, setColorMode] = useLocalStorage<ColorMode>('color-theme', 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (colorMode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [colorMode]);

  return { colorMode, setColorMode };
}


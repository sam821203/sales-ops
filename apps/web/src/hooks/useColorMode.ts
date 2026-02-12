import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type ColorMode = 'light' | 'dark';

export default function useColorMode() {
  const [colorMode, setColorMode] = useLocalStorage<ColorMode>('color-theme', 'light');

  useEffect(() => {
    const className = 'dark';
    const bodyClass = window.document.body.classList;

    if (colorMode === 'dark') bodyClass.add(className);
    else bodyClass.remove(className);
  }, [colorMode]);

  return [colorMode, setColorMode] as const;
}


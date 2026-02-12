declare module '@vitejs/plugin-react' {
  import type { PluginOption } from 'vite';

  export interface ReactPluginOptions {
    /**
     * Passed through to the underlying plugin; kept broad on purpose so
     * this declaration works even if editor TypeScript can't resolve the
     * package's bundled types.
     */
    [key: string]: unknown;
  }

  export default function react(options?: ReactPluginOptions): PluginOption;
}


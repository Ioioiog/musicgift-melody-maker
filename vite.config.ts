import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Custom middleware to set Content-Type headers for JS/TS files
function ensureMimeTypeForModules(): Plugin {
  return {
    name: 'vite:mime-type-fix',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        (
          req: IncomingMessage,
          res: ServerResponse,
          next: () => void
        ) => {
          if (req.url?.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
          } else if (req.url?.endsWith('.ts')) {
            res.setHeader('Content-Type', 'application/typescript');
          } else if (req.url?.endsWith('.tsx')) {
            res.setHeader('Content-Type', 'application/typescript');
          }
          next();
        }
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    ensureMimeTypeForModules(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: ['es2022', 'chrome89', 'firefox89', 'safari15'],
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-tooltip'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          motion: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  esbuild: {
    target: 'es2022',
    treeShaking: true
  }
}));

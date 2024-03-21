import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default ({ mode }: { mode: string }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return defineConfig({
        plugins: [react()],
        resolve: {
          alias: {
            "@assets": "/src/assets",
          },
        },
    });
}

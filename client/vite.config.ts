import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Cấu hình vite development server
  server: {
    port: 3000,
    host: true,
    watch: {
      // Bật chế độ polling để theo dõi thay đổi file
      usePolling: true,
    },
  },
});

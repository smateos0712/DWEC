import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // Escucha en todas las interfaces para que se pueda abrir desde fuera del contenedor
    host: true,
    port: 5173,
    strictPort: true,
    // Necesario para detectar cambios en Windows, Mac y WSL con volúmenes montados
    watch: {
      usePolling: true,
    },
  },
});

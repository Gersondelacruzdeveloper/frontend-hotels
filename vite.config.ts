import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    https: fs.existsSync("./.cert/localhost.pem")
      ? {
          key: fs.readFileSync("./.cert/localhost-key.pem"),
          cert: fs.readFileSync("./.cert/localhost.pem"),
        }
      : false,
  },
});

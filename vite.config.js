import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "/tkw_2354050034_Han/",
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        login: "login.html",
        register: "register.html",
        profile: "profile.html",
      },
    },
  },
});
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/applicant-tracking-system/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});

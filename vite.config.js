export default defineConfig({
    plugins: [react()],
    build: {
      outDir: 'build' // Change the output directory to "build"
    },
    css: {
      postcss: {
        plugins: [tailwindcss()],
      }
    }
  });
  
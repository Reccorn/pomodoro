import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autopefixer from 'autoprefixer'
import browserslistToEsbuild from 'browserslist-to-esbuild';

export default defineConfig({
	plugins: [react()],
	build: {
		target: browserslistToEsbuild(),
		minify: true,
	},
	css: {
		postcss: {
			plugins: [autopefixer]
		},
		modules: {
			generateScopedName: '[name]__[local]-[hash:base64:5]'
		}
	}
})

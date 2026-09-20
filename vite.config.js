import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
	root: './src',
	server: {
		port: 8080,
	},
	build: {
		outDir: '../dist',
		emptyOutDir: true,
	},
	publicDir: '../public',
	resolve: {
		alias: {
			'@/': path.resolve('/'),
		},
	},
})
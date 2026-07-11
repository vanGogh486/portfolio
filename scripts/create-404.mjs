import { copyFileSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const indexPath = join(distDir, 'index.html')
const notFoundPath = join(distDir, '404.html')

// Copy index.html to 404.html for SPA fallback on GitHub Pages
copyFileSync(indexPath, notFoundPath)
console.log('Created dist/404.html (SPA fallback from index.html)')

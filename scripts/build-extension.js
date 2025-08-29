/* eslint-disable */
import { build } from 'esbuild'
import fs from 'fs-extra'
import path from 'path'

const root = process.cwd()
const dist = path.join(root, 'dist')

async function main() {
  await fs.remove(dist)
  await fs.ensureDir(dist)

  // Process Tailwind CSS
  try {
    console.log('Processing Tailwind CSS...')
    const { execSync } = await import('child_process')
    execSync('npx tailwindcss -i ./src/index.css -o ./dist/popup.css --minify', { stdio: 'inherit' })
  } catch (error) {
    console.error('Error processing Tailwind CSS:', error.message)
    // Fallback: copy the original CSS file
    await fs.copy(path.join(root, 'src', 'index.css'), path.join(dist, 'popup.css'))
  }

  // Bundle popup.jsx -> popup.js
  await build({
    entryPoints: [path.join(root, 'src', 'popup.jsx')],
    bundle: true,
    outfile: path.join(dist, 'popup.js'),
    platform: 'browser',
    format: 'iife',
    sourcemap: false,
    target: ['chrome100'],
    jsx: 'automatic'
  })

  // Copy static files
  await Promise.all([
    fs.copy(path.join(root, 'manifest.json'), path.join(dist, 'manifest.json')),
    fs.copy(path.join(root, 'src', 'popup.html'), path.join(dist, 'popup.html')),
    fs.copy(path.join(root, 'src', 'background.js'), path.join(dist, 'background.js')),
    fs.copy(path.join(root, 'src', 'content.js'), path.join(dist, 'content.js')),
    fs.copy(path.join(root, 'src', 'userDashboard.html'), path.join(dist, 'userDashboard.html')),
    fs.copy(path.join(root, 'src', 'userDashboard.css'), path.join(dist, 'userDashboard.css')),
    fs.copy(path.join(root, 'src', 'userDashboard.js'), path.join(dist, 'userDashboard.js'))
  ])

  // Add a placeholder icon if not present
  const iconPath = path.join(root, 'icon.png')
  if (await fs.pathExists(iconPath)) {
    await fs.copy(iconPath, path.join(dist, 'icon.png'))
  } else {
    // Generate a minimal placeholder PNG (1x1 transparent)
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAADKqZBpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAABZJREFUeNpjYBgFo2AUjIJRMApGAAAt6wG7qg1K0AAAAABJRU5ErkJggg=='
    await fs.writeFile(path.join(dist, 'icon.png'), Buffer.from(pngBase64, 'base64'))
  }

  console.log('Built extension to dist/')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
}) 
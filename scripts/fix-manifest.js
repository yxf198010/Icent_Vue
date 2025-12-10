// scripts/fix-manifest.js
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve(process.cwd(), '../../Icent_LowCode/lowcode/static/lowcode_designer');

const viteManifestPath = path.join(OUTPUT_DIR, '.vite', 'manifest.json');
const rootManifestPath = path.join(OUTPUT_DIR, 'manifest.json');

if (fs.existsSync(viteManifestPath)) {
  console.log('[postbuild] 发现 .vite/manifest.json，正在复制到根目录...');
  const manifestContent = fs.readFileSync(viteManifestPath, 'utf8');
  fs.writeFileSync(rootManifestPath, manifestContent, 'utf8');
  console.log('[postbuild] ✅ manifest.json 已放置到根目录');
} else if (fs.existsSync(rootManifestPath)) {
  console.log('[postbuild] manifest.json 已在根目录，无需处理');
} else {
  console.error('[postbuild] ❌ 错误：未找到 manifest.json！');
  process.exit(1);
}
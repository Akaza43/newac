import { NextApiRequest, NextApiResponse } from 'next';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const APP_DIR = join(process.cwd(), 'src', 'app');
const EXCLUDED_FILES = ['layout.tsx', 'loading.tsx', 'error.tsx'];

function getPages(dir: string = APP_DIR, basePath: string = ''): any[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const pages: any[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const routePath = join(basePath, entry.name).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      pages.push(...getPages(fullPath, routePath));
    } else if (
      entry.isFile() &&
      entry.name === 'page.tsx' &&
      !EXCLUDED_FILES.includes(entry.name)
    ) {
      const name = basePath.split('/').pop() || 'Home';
      pages.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        path: routePath.replace('/page.tsx', '') || '/',
      });
    }
  }

  return pages;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pages = getPages();
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error scanning app directory:', error);
    res.status(500).json({ error: 'Failed to scan app directory' });
  }
}

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(process.cwd(), 'src/pages');
const outputFile = path.join(process.cwd(), 'src/lib/pageIndex.json');

function scanDirectory(dir, basePath = '') {
  const files = fs.readdirSync(dir);
  
  return files.reduce((pages, file) => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    
    if (isDirectory && file !== 'api') {
      return [...pages, ...scanDirectory(filePath, `${basePath}/${file}`)];
    }
    
    if (file.endsWith('.tsx') && !['_app.tsx', '_document.tsx'].includes(file)) {
      const name = file.replace('.tsx', '');
      const routePath = basePath + '/' + (name === 'index' ? '' : name);
      
      return [...pages, {
        name: name === 'index' ? 'Home' : name.charAt(0).toUpperCase() + name.slice(1),
        path: routePath || '/',
      }];
    }
    
    return pages;
  }, []);
}

const pages = scanDirectory(pagesDir);

const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(pages, null, 2));
console.log('Page index generated successfully!');

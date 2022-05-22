const fs = require('fs');
const path = require('path');

createBundleCss();

async function createBundleCss() {
  fs.promises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '');

  const cssFiles = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });

  const cssData = [];
  
  for (const file of cssFiles) {
    if (file.isFile()) {
      const extension = path.extname(path.join(__dirname, 'styles', file.name.toString()));
      if (extension === '.css') {
        await fs.promises.readFile(path.join(__dirname, 'styles', file.name.toString()))
          .then(data => cssData.push(data));
      }
    } 
  }
  
  cssData.forEach((css) => {
    fs.promises.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), css);
  });

  process.stdout.write('bundle.css создан!');
}

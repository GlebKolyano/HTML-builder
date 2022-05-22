const fsPromises = require('fs/promises');
const path = require('path');


buildPage();

async function buildPage() {
  fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

  copyAssets(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));

  createStyle();
  
  createHTML();
}

async function copyAssets(from, to) {
  fsPromises.mkdir(to,  { recursive: true });

  const assetsFiles = await fsPromises.readdir(from);
  
  for (let file of assetsFiles) {
    let fileCopy = await fsPromises.lstat(path.join(from, file));

    if (fileCopy.isFile()) {
      fsPromises.copyFile(path.join(from, file), path.join(to, file));
    } else {
      copyAssets(path.join(from, file), path.join(to, file));
    }
  }

  const distAssetsFiles = await fsPromises.readdir(to);

  for (let file of distAssetsFiles) {
    let fileCopy = await fsPromises.lstat(path.join(to, file));
    if (!assetsFiles.includes(file)) {
      if (fileCopy.isFile()) {
        console.log('is File');
        // fsPromises.unlink(path.join(to, file));
      } else {
        console.log('is Folder');
        await deleteFolder(to, file);
      }
      
    }
  }
}

async function deleteFolder(to, elem) {
  const filesFolder = await fsPromises.readdir(path.join(to, elem));

  for (let file of filesFolder) {
    fsPromises.unlink(path.join(to, elem, file));
  }
  fsPromises.rmdir(path.join(to, elem));
}

async function createStyle() {
  fsPromises.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '');

  const allCssFiles = await fsPromises.readdir(path.join(__dirname, 'styles'));

  const cssData = [];

  for (let css of allCssFiles) {
    const fileCopy = await fsPromises.lstat(path.join(__dirname, 'styles', css));
    const ext = path.extname(path.join(__dirname, 'styles', css));
    
    if (fileCopy.isFile() && ext === '.css') {
      await fsPromises.readFile(path.join(__dirname, 'styles', css)).then(data => cssData.push(data));
    }

  }

  cssData.forEach((css) => {
    fsPromises.appendFile(path.join(__dirname, 'project-dist', 'style.css'), css);
  });
}

async function createHTML() {
  let template = await fsPromises.readFile(path.join(__dirname, 'template.html'));

  let components = await fsPromises.readdir(path.join(__dirname, 'components'));

  // check all files in components === html
  for (let elem of components) {
    let copyElem = await fsPromises.lstat(path.join(__dirname, 'components', elem));

    const extension = path.extname(path.join(__dirname, 'components', elem));

    // filter not html files
    if (copyElem.isFile() && extension !== '.html') {
      components = components.filter(el => {
        return el !== elem;
      });
    } 
  }

  // replace all template tags to html from components
  let tepmplateHTML = template.toString();

  for (let html of components) {
    let tempalateOfComponent = await fsPromises.readFile(path.join(__dirname, 'components', html));

    tepmplateHTML = tepmplateHTML.replace(`{{${html.split('.')[0]}}}`, tempalateOfComponent);
  }

  // create index.html and write templateHTML to this file
  fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), tepmplateHTML);
}





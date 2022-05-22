const fs = require('fs/promises');
const path = require('path');
const readdir = fs.readdir;

copyDirectory();


async function copyDirectory() {
  fs.mkdir(path.join(__dirname, 'files-copy'),  { recursive: true });
  const files = await readdir(path.join(__dirname, 'files'));

  files.forEach(file => {
    fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
  });

  const filesCopy = await readdir(path.join(__dirname, 'files-copy'));
  
  for (let file of filesCopy) {
    if (!files.includes(file)) {
      await fs.unlink(path.join(__dirname, 'files-copy', file));
    }
  }
  process.exit();
}

process.on('exit', () => console.log('Копирование прошло успешно!'));
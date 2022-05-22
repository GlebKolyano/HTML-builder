const path = require('path');
const fs = require('fs').promises;
const readdir = fs.readdir;


readFiles();

async function readFiles() {
  try {
    const files = await readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});
    console.log('\x1b[33m%s\x1b[0m', 'Если значения не такие как у вас, обратите внимание, что конвертация в kb!');
    for (const file of files)
      if (file.isFile()) {
        const name = file.name.toString().split('.')[0];
        const extension = path.extname(file.name).substring(1);
        const size = await fs.stat(path.join(__dirname, 'secret-folder', file.name));

        const fileSizeInKb = size.size * 0.00098;
        const str = `${name} - ${extension} - ${fileSizeInKb}kb`;
        console.log(str);
      }
  } catch (err) {
    console.error(err);
  }
}

const readdir = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { stdout } = require('process');


const getInfoFile = (file) => {
  const fileInfo = path.join(__dirname, 'secret-folder', file.name);

  fs.stat(fileInfo, (err, stats) => {
    if (stats.isFile()) {stdout.write(`${path.parse(fileInfo).name} - ${path.extname(fileInfo).slice(1)} - ${stats.size * 0.00098}kb \n`);}
  });
};


const dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, {withFileTypes: true}, (err, files) => {
  files.forEach(file => {
    getInfoFile(file);
  });
});
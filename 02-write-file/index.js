const { stdin: input, stdout: output, exit, stdout } = require('process');
const path = require('path');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({ input, output });

addText();

function addText() {
  let newText;
  fs.readFile(path.join(__dirname, 'text.txt'), (err, data) => {
    let oldText = '';
    if (err) init();
    if (data) oldText = data.toString();
    newText = oldText;
  });

  rl.question('Привет! Введите текст для записи:  ', (str) => {
    if (str.toLowerCase().trim() === 'exit') return exit();
    newText += `\n${str}`;
    fs.writeFile(path.join(__dirname, 'text.txt'), newText, (err) => {
      if (err) return console.error(err.message); 
    });
    console.log('\nЗаметка создана\n');
    return addText();
  });
}

function init() {
  fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
    if (err) return console.error(err.message);
  });
}

process.on('exit', () => stdout.write('\nЗапись окончена!'));

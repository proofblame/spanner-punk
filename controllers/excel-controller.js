const multer = require('multer')
const { parse } = require('../services/excel-service')
var fs = require("fs");
const { PythonShell } = require('python-shell');
const {spawn} = require('child_process')
// import {PythonShell} from 'python-shell';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

// const childPython = spawn('python', [`${__dirname}/python/Sber_excel.py`])



const uploadFile = async (req, res) => {
  console.log(req.file.originalname)
  const childPython = spawn('python', [`${__dirname}/../python/Sber_excel.py`, `${__dirname}/../uploads/${req.file.originalname}`])

  childPython.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
    console.log(data)
  })
  childPython.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })
  childPython.on('close', (code) => {
    console.log(`Child process exited with code: ${code}`)
  })

  console.log('//------------------Res---------------//')

  // const options = {
  //   // pythonPath: ['C:\Users\MarokkoTV\AppData\Local\Programs\Python\Python310\python.exe'],
  //   pythonOptions: ['-u'],
  //   scriptPath: './python',
  //   // encoding: 'utf8',
  //   // mode: 'binary',
  //   // args: []
  // }


  //   PythonShell.run('Sber_excel.py', options, function (err, res) {
  //     if (err) throw err;
  //     console.log(res);
  // });

  // `${pythonPath} -m py_compile ${filePath}`;
  // parse(req.file.path)
  // fs.unlink(req.file.path, function (err) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("Файл удалён");
  //   }
  // });
}

module.exports = {
  uploadFile,
  upload
}

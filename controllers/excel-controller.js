const multer = require('multer')
const { parse } = require('../services/excel-service')
var fs = require("fs");
const { PythonShell } = require('python-shell');
const { spawn } = require('child_process')
// import {PythonShell} from 'python-shell';
const { getExtension } = require('../utils/getExtension')
const { checkExtension } = require('../utils/checkExtension')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`)
  }
})

// Проверка mimetype
const validateExcelFile = (req, file, cb) => {
  if (!file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    cb(null, false);
  }
  let extension = getExtension(file.originalname)
  let isExcel = checkExtension(extension, 'xlsx')
  if (!isExcel) {
    cb(null, false);
    throw new Error('Файл должен быть .xlsx или .xlx')
  }
  cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: validateExcelFile })

const uploadFile = async (req, res) => {
  let file = req.file;
  if (!file) {
    throw new Error('Ошибка загрузки файла')
  }
  // console.log(file)

  // const childPython = spawn('python', [`${__dirname}/../python/python_script.py`, `${__dirname}/../uploads/`, `${req.file.fieldname}`])

  // childPython.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`)
  // })
  // childPython.stderr.on('data', (data) => {
  //   console.error(`stderr: ${data}`)
  // })
  // childPython.on('close', (code) => {
  //   console.log(`Child process exited with code: ${code}`)
  // })

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

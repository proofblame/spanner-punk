const multer = require('multer')
const { parse } = require('../services/excel-service')
var fs = require("fs");
const { PythonShell } = require('python-shell');
const { spawn } = require('child_process')
// import {PythonShell} from 'python-shell';
const { getExtension } = require('../utils/getExtension')
const { checkExtension } = require('../utils/checkExtension')
const { deleteExtension } = require('../utils/deleteExtension')



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.${getExtension(file.originalname)}`)
  }
})

// Проверка mimetype
const validateExcelFile = (req, file, cb) => {
  if (!file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    cb(null, false);
  } else {
    cb(null, true);
  }
}

const upload = multer({ storage: storage, fileFilter: validateExcelFile })

const uploadFile = async (req, res) => {
  let file = req.file;
  if (!file) {
    throw new Error('Ошибка загрузки файла')
  }
  let extension = getExtension(file.originalname)
  let isExcel = checkExtension(extension, 'xlsx')
  if (!isExcel) {
    throw new Error('Файл должен быть .xlsx или .xlx')
  }
  // console.log(file)
  const options = [
    `${__dirname}/../python/python_script.py`,
    // directory
    `${__dirname}/../uploads/`,
    // file_name
    `${deleteExtension(file.filename)}`,
    // file_extension
    `${extension}`,
    // output_directory
    `${__dirname}/../outputs/`,
  ]

  const childPython = spawn('python', options)

  childPython.stdout.on('data', (data) => {
    const res = JSON.parse(`${data}`)
    if (res.status !== 'success') {
      throw new Error('Ошибка скрипта python')
    }
    fs.readFile(`${__dirname}/../outputs/${deleteExtension(file.filename)}.json`, 'utf8', function (error, fileContent) {
      if (error) {
        throw new Error('Не удалось прочесть файл');
      }
      // console.log(fileContent);
    });
  })
  childPython.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })
  childPython.on('close', (code) => {
    console.log(`Child process exited with code: ${code}`)
    try {
      fs.unlinkSync(`${__dirname}/../uploads/${file.filename}`);
      console.log('deleted')
    } catch (error) {
      console.log(error)
    }
  })
  console.log('//------------------Res---------------//')
}

module.exports = {
  uploadFile,
  upload
}

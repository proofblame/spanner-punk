const multer = require('multer')
const { parse } = require('../services/excel-service')
var fs = require("fs");
const { PythonShell } = require('python-shell');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.xlsx')
  }
})

const upload = multer({ storage: storage })


const uploadFile = async (req, res) => {
  console.log(storage)
  const options = {
    // pythonPath: ['C:\Users\MarokkoTV\AppData\Local\Programs\Python\Python310\python.exe'],
    pythonOptions: ['-u'],
    scriptPath: './python',
    encoding: 'utf8',
    mode: 'binary',
    args: []
  }


    PythonShell.run('Sber_excel.py', options, function (err, res) {
      if (err) throw err;
      console.log(res);
  });

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

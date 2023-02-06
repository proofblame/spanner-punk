const multer = require('multer');
const fs = require('fs');
const { spawn } = require('child_process');
const { getExtension } = require('../utils/getExtension');
const { checkExtension } = require('../utils/checkExtension');
const { deleteExtension } = require('../utils/deleteExtension');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.${getExtension(file.originalname)}`);
  },
});

// Проверка mimetype
const validateExcelFile = (req, file, cb) => {
  if (!file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter: validateExcelFile });

const uploadFile = async (req, res) => {
  const { file } = req;
  if (!file) {
    throw new Error('Ошибка загрузки файла');
  }
  const extension = getExtension(file.originalname);
  const isExcel = checkExtension(extension, 'xlsx');
  if (!isExcel) {
    throw new Error('Файл должен быть .xlsx или .xlx');
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
  ];

  const childPython = spawn('python', options);

  childPython.stdout.on('data', (data) => {
    const res = JSON.parse(`${data}`);
    if (res.status !== 'success') {
      throw new Error('Ошибка скрипта python');
    }
    fs.readFile(`${__dirname}/../outputs/${deleteExtension(file.filename)}.json`, 'utf8', (error, fileContent) => {
      if (error) {
        throw new Error('Не удалось прочесть файл');
      }
      // console.log(fileContent);
    });
  });
  childPython.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  childPython.on('close', (code) => {
    console.log(`Child process exited with code: ${code}`);
    try {
      fs.unlinkSync(`${__dirname}/../uploads/${file.filename}`);
      console.log('deleted');
    } catch (error) {
      console.log(error);
    }
  });
  console.log('//------------------Res---------------//');
};

module.exports = {
  uploadFile,
  upload,
};

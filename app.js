const express = require('express');
const fs = require('fs');
const multer = require('multer')

// const pyshell = new PythonShell(__dirname + '/python/Sber_excel.py');
const {uploadFile, upload} = require('./controllers/excel-controller')

const { PORT = 3000 } = process.env;

const app = express();


app.use('/static', express.static(__dirname + '/public'));

app.post('/post', upload.single('file'), uploadFile)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

const express = require('express');
const fs = require('fs');
const multer = require('multer')

// const pyshell = new PythonShell(__dirname + '/python/Sber_excel.py');
const {uploadFile, upload} = require('./controllers/excel-controller')

const { PORT = 3000 } = process.env;

const app = express();



app.use('/static', express.static(__dirname + '/public'));

app.post('/post', upload.single('file'), uploadFile)

  // pyshell.send(req.file);

//   pyshell.on('message', function (message) {
//     // received a message sent from the Python script (a simple "print" statement)
//     console.log(message);
//   });

//   // end the input stream and allow the process to exit
//   pyshell.end(function (err,code,signal) {
//     if (err) throw new Error(err);
//     console.log('The exit code was: ' + code);
//     console.log('The exit signal was: ' + signal);
//     console.log('finished');
//   });


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

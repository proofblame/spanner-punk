const express = require('express');
const fs = require('fs');
const multer = require('multer')
const { PythonShell } = require('python-shell');
// const pyshell = new PythonShell(__dirname + '/python/Sber_excel.py');

const { PORT = 3000 } = process.env;

const app = express();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })



app.use('/static', express.static(__dirname + '/public'));

app.post('/post', upload.single('file'), (req, res) => {
  // pyshell.send(req.file);
const params = {
  path: req.file.path
}

  PythonShell.run('./python/Sber_excel.py', params, function (err, res) {
    if (err) throw err;
    console.log(res);
});
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
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

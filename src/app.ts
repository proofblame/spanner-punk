import express from 'express';





// const pyshell = new PythonShell(__dirname + '/python/Sber_excel.py');
// import { uploadFile, upload } from './controllers/excel-controller';

const { PORT = 3000 } = process.env;

const app = express();


app.use('/static', express.static(__dirname + '/static'));

// app.post('/post', upload.single('file'), uploadFile)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

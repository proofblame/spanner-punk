import express from "express";
import dotenv from "dotenv";
import router from "./routes";

dotenv.config();

const { PORT = 3000 } = process.env;

const app = express();

app.use(router);

// app.post('/post', upload.single('file'), uploadFile)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

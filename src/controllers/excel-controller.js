import multer from "multer";
import fs from "fs";
import { spawn } from "child_process";
import Extention from "../utils/Extention";

const uploadFile = async (req, res) => {
  const { file } = req;
  if (file !== null) {
    throw new Error("Ошибка загрузки файла");
  }
  const extension = Extention.get(file.originalname);
  const isExcel = Extention.check(extension, "xlsx");
  if (!isExcel) {
    throw new Error("Файл должен быть .xlsx или .xlx");
  }
  // console.log(file)
  const options = [
    `${__dirname}/../python/python_script.py`,
    // directory
    `${__dirname}/../uploads/`,
    // file_name
    `${Extention.delete(file.filename)}`,
    // file_extension
    `${extension}`,
    // output_directory
    `${__dirname}/../outputs/`,
  ];

  const childPython = spawn("python", options);

  childPython.stdout.on("data", (data) => {
    const res = JSON.parse(`${data}`);
    if (res.status !== "success") {
      throw new Error("Ошибка скрипта python");
    }
    fs.readFile(
      `${__dirname}/../outputs/${Extention.delete(file.filename)}.json`,
      "utf8",
      (error, fileContent) => {
        if (error) {
          throw new Error("Не удалось прочесть файл");
        }
        console.log(fileContent);
      }
    );
  });
  childPython.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
  childPython.on("close", (code) => {
    console.log(`Child process exited with code: ${code}`);
    try {
      fs.unlinkSync(`${__dirname}/../uploads/${file.filename}`);
      console.log("deleted");
    } catch (error) {
      console.log(error);
    }
  });
  console.log("//------------------Res---------------//");
};

// module.exports = {
//   uploadFile,
//   upload,
// };

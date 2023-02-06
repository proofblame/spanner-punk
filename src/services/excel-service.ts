import { spawn } from "child_process";
import fs from "fs";
import Extention from "../utils/Extention";

const convertExcel = ({
  filename,
  extension,
}: {
  filename: string;
  extension: string;
}) => {
  const options = [
    `${__dirname}/../../python/bank_controlles/Sber_excel.py`,
    // directory
    `${__dirname}/../../../../uploads/`,
    // file_name
    `${Extention.delete(filename)}`,
    // file_extension
    `${extension}`,
    // output_directory
    `${__dirname}/../../outputs/`,
  ];

  const childPython = spawn("python", options);

  childPython.stdout.on("data", (data) => {
    const res = JSON.parse(`${data}`);
    if (res.status !== "success") {
      throw new Error("Ошибка скрипта python");
    }
    fs.readFile(
      `${__dirname}/../outputs/${Extention.delete(filename)}.json`,
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
      // fs.unlinkSync(`${__dirname}/../../uploads/${filename}`);
      console.log("deleted");
    } catch (error) {
      console.log(error);
      console.log(__dirname);
    }
  });
  console.log("//------------------Res---------------//");
};

export default convertExcel;

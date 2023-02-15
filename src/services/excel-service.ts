import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import Extention from "../utils/Extention";

const convertExcel = async ({
  fileName,
  bank,
}: {
  fileName: string;
  bank: string;
}) => {
  let data = null;

  const uploadsDirectory = path.resolve(__dirname, "../../uploads/");

  const outputDirectory = path.resolve(__dirname, "../../outputs/");

  const options = [
    // directory
    `${__dirname}/../../python/bank_controlles/${bank}_excel.py`,

    // path_to_file
    path.resolve(uploadsDirectory, fileName),

    // file_name
    `${Extention.delete(fileName)}`,

    // output_directory
    `${outputDirectory}/`,
  ];
  const childPython = spawnSync("python", options);
  try {
    // return childPython
    const res = JSON.parse(childPython.stdout.toString("utf-8"));

    if (res.status !== "success") {
      throw new Error("Ошибка скрипта python");
    }

    data = fs.readFileSync(
      `${outputDirectory}/${Extention.delete(fileName)}.json`,
      "utf8"
    );

    fs.unlinkSync(`${outputDirectory}/${Extention.delete(fileName)}.json`);
  } catch (error) {
    throw new Error(childPython.stderr.toString("utf-8"));
  } finally {
    fs.unlinkSync(`${uploadsDirectory}/${fileName}`);
  }

  return JSON.parse(data);
};

export default convertExcel;

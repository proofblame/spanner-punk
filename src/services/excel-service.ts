import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import Extention from "../utils/Extention";

const convertExcel = async ({ filename }: { filename: string }) => {
  let data = null;

  const uploadsDirectory = path.resolve(__dirname, "../../uploads/");

  const outputDirectory = path.resolve(__dirname, "../../outputs/");

  const options = [
    // directory
    `${__dirname}/../../python/bank_controlles/Sber_excel.py`,

    // path_to_file
    path.resolve(uploadsDirectory, filename),

    // file_name
    `${Extention.delete(filename)}`,

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
      `${outputDirectory}/${Extention.delete(filename)}.json`,
      "utf8"
    );

    fs.unlinkSync(`${outputDirectory}/${Extention.delete(filename)}.json`);
  } catch (error) {
    throw new Error(childPython.stderr.toString("utf-8"));
  } finally {
    fs.unlinkSync(`${uploadsDirectory}/${filename}`);
  }

  return JSON.parse(data);
};

export default convertExcel;

import { spawn, spawnSync } from "child_process";
import fs from "fs";
import Extention from "../utils/Extention";

const convertExcel = async ({
  filename,
  extension,
}: {
  filename: string;
  extension: string;
}) => {
  const options = [
    `${__dirname}/../../python/bank_controlles/Sber_excel.py`,
    // directory
    `${__dirname}/../../uploads/`,
    // file_name
    `${Extention.delete(filename)}`,
    // file_extension
    `${extension}`,
    // output_directory
    `${__dirname}/../../outputs/`,
  ];

  let err = null;

  const childPython = spawnSync("python", options);

  err = childPython.stderr.toString("utf-8");

  if (err === null) {
    throw Error(err);
  }

  const res = JSON.parse(childPython.stdout.toString("utf-8"));
  if (res.status !== "success") {
    throw new Error("Ошибка скрипта python");
  }

  const data = fs.readFileSync(
    `${__dirname}/../../outputs/${Extention.delete(filename)}.json`,
    "utf8"
  );
  fs.unlinkSync(`${__dirname}/../../uploads/${filename}`);
  fs.unlinkSync(
    `${__dirname}/../../outputs/${Extention.delete(filename)}.json`
  );

  return JSON.parse(data);
};

export default convertExcel;

import { spawnSync } from "child_process";
import fs from "fs";

const convertPDF = async ({
  filename,
  path,
}: {
  filename: string;
  path: string;
}) => {
  try {
    const options = [`${__dirname}/../../python/pdf-selenium.py`, `${path}`];
    // const options = [`/home/oris/backend/python/pdf-selenium.py`, `${path}`];
    const childPython = spawnSync("python", options);
    const res = await JSON.parse(childPython.stdout.toString("utf-8"));
    if (res.status !== "success") {
      throw new Error("Ошибка скрипта python");
    }
    fs.unlinkSync(`${__dirname}/../../uploads/${filename}`);
    // fs.unlinkSync(`/home/oris/backend/uploads/${filename}`);
  } catch (error) {
    throw new Error(`Ошибка: ${error}`);
  }
  return { status: "success" };
};

export default convertPDF;

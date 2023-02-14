import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const convertPDF = async ({ pathFile }: { pathFile: string }) => {
  const outputDirectory = path.resolve(__dirname, "../../uploads/");
  try {
    const options = [
      `${__dirname}/../../python/pdf-selenium.py`,
      `${pathFile}`,
      outputDirectory,
    ];
    const childPython = spawnSync("python", options);
    // return childPython
    const res = await JSON.parse(childPython.stdout.toString("utf-8"));
    if (res.status !== "success") {
      throw new Error("Ошибка скрипта python");
    }
  } catch (error) {
    throw new Error(`Ошибка: ${error}`);
  } finally {
    fs.unlinkSync(`${pathFile}`);
  }
  return { status: "success" };
};

export default convertPDF;

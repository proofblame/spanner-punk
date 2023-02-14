import { spawnSync } from "child_process";
import fs from "fs";

const convertPDF = async ({ pathFile }: { pathFile: string }) => {
  try {
    const options = [
      `${__dirname}/../../python/pdf-selenium.py`,
      `${pathFile}`,
    ];
    const childPython = spawnSync("python", options);
    return childPython
    const res = await JSON.parse(childPython.stdout.toString("utf-8"));
    if (res.status !== "success") {
      throw new Error("Ошибка скрипта python");
    }
    fs.unlinkSync(`${pathFile}`);
  } catch (error) {
    throw new Error(`Ошибка: ${error}`);
  }
  return { status: "success" };
};

export default convertPDF;

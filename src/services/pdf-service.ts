import { spawn, spawnSync } from "child_process";
import fs from "fs";

const convertPDF = async ({
  filename,
  path,
}: {
  filename: string;
  path: string;
}) => {
  // const options = [`${__dirname}/../../python/pdf-selenium.py`, `${path}`];
  const options = [`/home/oris/backend/python/pdf-selenium.py`, `${path}`];

  let err = null;

  const childPython = spawnSync("python", options);
  console.log(childPython);
  err = childPython.stderr.toString("utf-8");

  if (err !== null) {
    throw Error(err);
  }


  const res = await JSON.parse(childPython.stdout.toString("utf-8"));
  console.log(childPython.stdout.toString("utf-8"));
  if (res.status !== "success") {
    throw new Error("Ошибка скрипта python");
  }

  // fs.unlinkSync(`${__dirname}/../../uploads/${filename}`);
  fs.unlinkSync(`/home/oris/backend/uploads/${filename}`);

  return { data: 123 };
};

export default convertPDF;

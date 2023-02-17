import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import Extention from "../utils/Extention";
import convertExcel from "../services/excel-service";
import convertPDF from "../services/pdf-service";

const fileDirectory = path.resolve(__dirname, "../../uploads/");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, fileDirectory);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}.${Extention.get(file.originalname)}`
    );
  },
});

// Проверка mimetype
const validateFile = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ storage, fileFilter: validateFile });

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { file, body } = req;
    const { bank, type } = body;

    if (!file) {
      throw new Error("Ошибка загрузки файла");
    }
    const { filename, originalname, path: pathFile } = file;
    const extention = Extention.get(originalname);

    let data;
    let fileName = filename;

    const isBank = Extention.check(bank, ["gpbl", "sber", "vtb", "alpha"]);
    if (!isBank) {
      throw new Error("Невалидный банк");
    }

    if (extention === "pdf") {
      data = await convertPDF({ pathFile });
      if (data.status !== "success") {
        throw new Error("Ошибка конвертации .pdf");
      }
      fileName = `${Extention.delete(filename)}.xlsx`;
    }

    data = await convertExcel({ fileName, bank });

    // if (type === "excel") {
    //   const isExcel = Extention.check(extension, "xlsx");
    //   if (!isExcel) {
    //     throw new Error("Файл должен быть .xlsx или .xlx");
    //   }
    //   data = await convertExcel({ filename, bank });
    // } else {
    //   const isPDF = Extention.check(extension, "pdf");
    //   if (!isPDF) {
    //     throw new Error("Файл должен быть .pdf");
    //   }
    //   data = await convertPDF({ pathFile });
    //   if (data.status !== "success") {
    //     throw new Error("Ошибка конвертации .pdf");
    //   }
    //   const convertedFile = `${Extention.delete(filename)}.xlsx`;
    //   data = await convertExcel({ filename: convertedFile, bank });
    // }
    res.send({ data });
  } catch (err) {
    next(err);
  }
};

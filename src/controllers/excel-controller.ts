import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import Extention from "../utils/Extention";
import convertExcel from "../services/excel-service";
import convertPDF from "../services/pdf-service";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${__dirname}/../../uploads/`);
    // cb(null, `/home/oris/backend/uploads/`);
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

    if (!file) {
      throw new Error("Ошибка загрузки файла");
    }
    const { filename, originalname, path } = file;
    const extension = Extention.get(originalname);

    let data;

    if (body.type === "excel") {
      const isExcel = Extention.check(extension, "xlsx");
      if (!isExcel) {
        throw new Error("Файл должен быть .xlsx или .xlx");
      }
      data = await convertExcel({ filename, extension });
    } else {
      const isPDF = Extention.check(extension, "pdf");
      if (!isPDF) {
        throw new Error("Файл должен быть .pdf");
      }
      data = await convertPDF({ filename, path });
      if (data.status !== "success") {
        throw new Error("Ошибка конвертации .pdf");
      }
      data = { message: "Файл конвертирован и загружен" };
    }

    res.send({ data });
  } catch (err) {
    next(err);
  }
};

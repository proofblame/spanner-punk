import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import Extention from "../utils/Extention";
import convertExcel from "../services/excel-service";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
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
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ storage, fileFilter: validateFile });

export const uploadFile = async (req: Request) => {
  const { file } = req;

  if (!file) {
    throw new Error("Ошибка загрузки файла");
  }
  console.log();
  const { filename, originalname } = file;
  const extension = Extention.get(originalname);
  const isExcel = Extention.check(extension, "xlsx");
  if (!isExcel) {
    throw new Error("Файл должен быть .xlsx или .xlx");
  }


  convertExcel({ filename, extension });
};

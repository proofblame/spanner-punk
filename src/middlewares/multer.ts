import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import Extention from "utils/Extention";

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

const upload = multer({ storage, fileFilter: validateFile });

export default upload;

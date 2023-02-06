import express from "express";
import { upload, uploadFile } from "../controllers/excel-controller";
import { EXCEL_ROUTE } from "../utils/constants";

const router = express.Router();

router.post(EXCEL_ROUTE, upload.single("file"), uploadFile);

export default router;

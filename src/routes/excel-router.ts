import express from "express";
import { EXCEL_ROUTE } from "../utils/constants";

const router = express.Router();

router.post(EXCEL_ROUTE);

export default router;

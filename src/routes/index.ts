import express from "express";
import routerExcel from "./excel-router";

const router = express.Router();

router.use(routerExcel);

export default router;

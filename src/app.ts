import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { errors } from "celebrate";
import router from "./routes";
import { errorLogger, requestLogger } from "./middlewares/logger";

dotenv.config();

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(requestLogger);

app.use(router);
app.use(errorLogger);
app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import routes from "./routes/index.js";

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

const app = express();

app.use(bodyParser({ limit: "50mb" }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
dotenv.config();

// * Routes
app.use("/api", routes);

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `Server is alive on http://${process.env.HOST}:${process.env.PORT}`
  );
});

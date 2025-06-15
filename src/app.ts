import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import multer from "multer";
import authRouter from "./routes/authRoutes";
import globalErrorHandling from "./controllers/errorController";
import itemsRouter from "./routes/itemsRoutes";


const app = express();
//? Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Set the correct policy here
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "dist")));
app.use("/public", express.static(path.join(__dirname, "./../public")));

// const upload = multer({ dest: "uploads/" });

// app.post("/api/upload", upload.single("image"), (req, res) => {
//   console.log(req.file);
//   res.status(200).json(req.file);
// });

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/items", itemsRouter);

app.use(globalErrorHandling);

export default app;

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";                         
import swaggerUi from "swagger-ui-express";
import router from "./routes";
import swaggerSpecs from "./swagger";

import { setServers } from "node:dns/promises";
import { connectDB } from "./utils/connectDb";

setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
const app = express();

const corsOptions = {
  credentials: false,
  origin: [
    "http://localhost:5173",
    "http://localhost:80",
    "https://wd-barcode-app.netlify.app",
    "http://localhost:3000",
    "http://localhost:4000",
    "https://widepos.netlify.app",
  ],
};

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        scriptSrc:   ["'self'"],
        styleSrc:    ["'self'", "'unsafe-inline'"],
        imgSrc:      ["'self'", "data:"],
        connectSrc:  ["'self'"],
        fontSrc:     ["'self'"],
        objectSrc:   ["'none'"],
        frameSrc:    ["'none'"],
        upgradeInsecureRequests: isProduction ? [] : null,
      },
    },
    hsts: isProduction
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,                                        
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/", router());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/", (req, res) => {
  res.send("WD Barcode App");
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
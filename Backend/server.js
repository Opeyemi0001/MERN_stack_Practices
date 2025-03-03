import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import fs from "node:fs";

dotenv.config();

const port = process.env.PORT || 6000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// routes
const routeFiles = fs.readdirSync("./src/routes");
console.log(routeFiles);

routeFiles.forEach((file) => {
  // use dynamic import
  import (`./src/routes/${file}`).then((route)=>{
    app.use("/api/v1", route.default);
  }).catch((err)=>{
    console.log("Failed to load routees file", err);
  })
})

const server = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Server failed to start sever...", error.message);
    process.exit(1);
  }
};

server();

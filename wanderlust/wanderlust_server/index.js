import express from "express";
import dotenv from "dotenv";

dotenv.config()

const app = express();
const port = process.env.PORT;

app.get("/", (res, req) => {
  res.send("Hello From WanderLust Server");
});

console.log("server is ready");

app.listen(port, () => {
  console.log(`server is ready. server is running on port ${port}`);
});

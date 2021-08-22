import compression from "compression";
import http from "http";
import express from "express";
import api_router from "./api/api";

const app = express();
const port = 3000;

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/", api_router);
app.use("/", express.static("static"));
app.use("/data/", express.static("data"));
app.use("/img/", express.static("img"));

http.createServer(app).listen(port);

console.log(`Worker ${process.pid} started on ${port} port `);

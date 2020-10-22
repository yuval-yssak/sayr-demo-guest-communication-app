import express from "express";

const app = express();
app.get("/", (_req, res) => res.send("hello"));
app.listen(4000, () => console.log("listening on port 4000."));

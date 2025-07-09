import express from "express";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const app = express();

app.use(express.json());

app.get("/api/v1", (req, res) => {
  res.send("<h1>Hello world<h1/>");
  console.log("Hello world");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Listening on port: ${port}`);
});

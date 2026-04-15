import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sakthi@2004",
  database: "hospital_db"
});

db.connect(err => {
  if (err) {
    console.log("DB Connection Failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.get("/patients", (req, res) => {
  db.query("SELECT * FROM patient", (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
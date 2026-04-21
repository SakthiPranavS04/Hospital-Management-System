import mysql from "mysql2";
import fs from "fs";
import path from "path";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sakthi@2004",
  multipleStatements: true
});

db.connect(err => {
  if (err) {
    console.log("Connection Error:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL");
});

// Read SQL file
const sqlFilePath = path.resolve("../hospital_db.sql");
const sql = fs.readFileSync(sqlFilePath, "utf8");

// Execute SQL
db.query(sql, (err, results) => {
  if (err) {
    console.error("Error executing SQL:", err.message);
  } else {
    console.log("✅ Database initialized successfully!");
    console.log("Tables created and test data imported");
  }
  db.end();
  process.exit(0);
});

import pkg from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

console.log("👉 DATABASE_URL =", process.env.DATABASE_URL);

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDB() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    // ✅ Correct path (same folder)
    const sqlFilePath = path.resolve("schema.sql");
    const sql = fs.readFileSync(sqlFilePath, "utf8");

    await client.query(sql);

    console.log("✅ Database initialized successfully!");

    await client.end();
    process.exit(0);

  } catch (err) {
  console.error("❌ Full Error:", err);   // 👈 change this line
  process.exit(1);
}
}

initDB();

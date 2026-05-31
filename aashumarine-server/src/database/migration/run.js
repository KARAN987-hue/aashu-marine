import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();
const { DB_NAME } = process.env;

async function runMigrations() {
  try {
    console.log("🔗 Connecting to MySQL server...");
    const connection = db;

    // 1. Drop existing database
    console.log(`🗑 Dropping database '${DB_NAME}' if it exists...`);
    await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);

    // 2. Create a new database
    console.log(`📦 Creating database '${DB_NAME}'...`);
    await connection.query(`CREATE DATABASE \`${DB_NAME}\`;`);
    await connection.query(`USE \`${DB_NAME}\`;`);

    // 3. Read all SQL files inside src/database/migration/sql/
    const sqlDir = path.resolve("src/database/migration/sql");
    const sqlFiles = fs.readdirSync(sqlDir).filter(f => f.endsWith(".sql")).sort();

    console.log(`📄 Found ${sqlFiles.length} migration files:`);
    sqlFiles.forEach(f => console.log("   ➤", f));

    // 4. Execute each file in order
    for (const file of sqlFiles) {
      const filePath = path.join(sqlDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`🚀 Executing migration: ${file}`);
      try {
        // Remove comments and split SQL file by semicolons
        const statements = sql
          .split('\n')
          .filter(line => !line.trim().startsWith('--')) // Remove comment lines
          .join('\n')
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);
        
        for (const statement of statements) {
          if (statement.trim()) {
            await connection.query(statement);
          }
        }
        console.log(`✅ Success: ${file}`);
      } catch (err) {
        console.error(`❌ Error in ${file}:`, err.message);
        process.exit(1);
      }
    }

    console.log("🎉 All migrations executed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();

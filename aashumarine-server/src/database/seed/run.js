import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();

async function runSeeds() {
  try {
    console.log("🌱 Starting database seeding...");
    const connection = db;

    const seedsDir = path.resolve("src/database/seed/sql");
    const sqlFiles = fs.readdirSync(seedsDir).filter(f => f.endsWith(".sql")).sort();

    console.log(`📄 Found ${sqlFiles.length} seed files:`);
    sqlFiles.forEach(f => console.log("   ➤", f));

    for (const file of sqlFiles) {
      const filePath = path.join(seedsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`🌱 Running seed: ${file}`);

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
        console.log(`✅ Seed executed: ${file}`);
      } catch (err) {
        console.error(`❌ Error in seed ${file}:`, err.message);
        process.exit(1);
      }
    }

    console.log("🎉 Seeding completed!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

runSeeds();

import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const MIGRATIONS_DIR = path.join(process.cwd(), "src/database/migration/sql");
const SEEDS_DIR = path.join(process.cwd(), "src/database/seed/sql");

async function resetDatabase() {
    try {
        console.log("🔗 Connecting to MySQL...");

        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true,
        });

        console.log("🗑 Dropping database:", process.env.DB_NAME);
        await db.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\`;`);

        console.log("📦 Creating fresh database...");
        await db.query(`CREATE DATABASE \`${process.env.DB_NAME}\`;`);

        console.log("🔄 Switching to database...");
        await db.changeUser({ database: process.env.DB_NAME });

        // -----------------------
        // Run Migrations
        // -----------------------
        console.log("\n📄 Running migrations...");
        const migrations = fs.readdirSync(MIGRATIONS_DIR).sort();

        for (const file of migrations) {
            const filePath = path.join(MIGRATIONS_DIR, file);
            const sql = fs.readFileSync(filePath, "utf8");

            try {
                console.log(`🚀 Executing migration: ${file}`);
                await db.query(sql);
                console.log(`   ✅ Success: ${file}`);
            } catch (err) {
                console.error(`❌ Error in migration ${file}:`, err.message);
                process.exit(1);
            }
        }

        // -----------------------
        // Run Seeds
        // -----------------------
        console.log("\n🌱 Running seeds...");
        const seedFiles = fs.readdirSync(SEEDS_DIR).sort();

        for (const file of seedFiles) {
            const filePath = path.join(SEEDS_DIR, file);
            const sql = fs.readFileSync(filePath, "utf8");

            try {
                console.log(`🌱 Executing seed: ${file}`);
                await db.query(sql);
                console.log(`   ✅ Seeded: ${file}`);
            } catch (err) {
                console.error(`❌ Error in seed ${file}:`, err.message);
                process.exit(1);
            }
        }

        console.log("\n🎉 DATABASE RESET COMPLETE!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Fatal Error:", err.message);
        process.exit(1);
    }
}

resetDatabase();

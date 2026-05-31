import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Use pool but name it "db"
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test connection
try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Pool Connected Successfully");
    connection.release();
} catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
}

export default db;
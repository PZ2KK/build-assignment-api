import express from "express";
import connectionPool from "./utils/db.mjs"; // นำเข้า connectionPool

const app = express();
const port = 4001;


app.use(express.json());

// ทดสอบการเชื่อมต่อฐานข้อมูล
app.get("/test-db", async (req, res) => {
  try {
    const client = await connectionPool.connect(); // เชื่อมต่อกับฐานข้อมูล
    await client.query("SELECT NOW()"); // ทดสอบ query
    client.release(); // ปล่อย connection กลับไปที่ pool
    res.json({ success: true, message: "Database connection successful!" });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ success: false, message: "Database connection failed.", error: error.message });
  }
});

// API สำหรับสร้างแบบทดสอบใหม่
app.post("/assignments", async (req, res) => {
  const { title, content, category } = req.body;


  if (!title || !content || !category) {
    return res.status(400).json({
      success: false,
      message: "Server could not create assignment because there are missing data from client",
    });
  }

  try {
    const client = await connectionPool.connect(); // เชื่อมต่อกับฐานข้อมูล
    const query = `
      INSERT INTO assignments (title, content, category)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [title, content, category];
    const result = await client.query(query, values); // เพิ่มข้อมูลลงในฐานข้อมูล
    client.release(); // ปล่อย connection กลับไปที่ pool

    res.status(201).json({
      success: true,
      message: "Assignment created successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create assignment:", error);
    res.status(500).json({
      success: false,
      message: "Server could not create assignment because database connection",
    });
  }
});

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

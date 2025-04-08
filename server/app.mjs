import express from "express";
import connectionPool  from "./utils/db.mjs";

const app = express();
app.use(express.json());

const port = 4000;

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/assignment", async (req, res) => {
  
  const newAssignment = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
  };

  try {
    await connectionPool.query(
      `insert into assignments (user_id, title, content, category, length, created_at, updated_at, published_at, status)
      values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        1, 
        newAssignment.title,
        newAssignment.content,
        newAssignment.category,
        newAssignment.length,
        newAssignment.created_at,
        newAssignment.updated_at,
        newAssignment.published_at,
        newAssignment.status,
      ]
    );
  } catch {
    return res
      .status(500)
      .json({
        message:
          "Server could not create assignment because database connection",
      });
  }

  return res.status(201).json({ message: "Created assignment sucessfully" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

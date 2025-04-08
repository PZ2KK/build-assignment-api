import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json())

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/assignments", async (req, res) => {
  try {
    const newAssignment = {
      ...req.body,
      created_at : new Date(),
      updated_at : new Date(),
      published_at : new Date(),
    }

    await connectionPool.query(
      `  
      INSERT INTO assignments
      (title, content, category)
      values ($1, $2, $3)
      `,
      [
       newAssignment.title,
       newAssignment.content,
       newAssignment.category,
      ]
    );
    return res.status(201).json({
      message: "Created assignment sucessfully",
    });
  } catch (error) {
    const status = error.response.status;
    if (status === 400 ) {
      return res.json({message: "Created assiServer could not create assignment because there are missing data from client"})
    } else {
      return res.json({message: "Server could not create assignment because database connection"})
    }
  }
})

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

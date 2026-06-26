import express from "express";
import db from "../db.js";

const router = express.Router();


// ✅ GET all projects
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ GET single project
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ CREATE project
router.post("/", async (req, res) => {
  const {
    title,
    description,
    technologies,
    image,
    github_link,
    live_link,
    live_demo,
    featured,
    category
  } = req.body;

  try {
    await db.query(
      `INSERT INTO projects 
      (title, description, technologies, image, github_link, live_link, live_demo, featured, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        technologies,
        image,
        github_link,
        live_link,
        live_demo,
        featured,
        category
      ]
    );

    res.json({ message: "Project created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ UPDATE project
router.put("/:id", async (req, res) => {
  const {
    title,
    description,
    technologies,
    image,
    github_link,
    live_link,
    live_demo,
    featured,
    category
  } = req.body;

  try {
    await db.query(
      `UPDATE projects SET 
        title=?,
        description=?,
        technologies=?,
        image=?,
        github_link=?,
        live_link=?,
        live_demo=?,
        featured=?,
        category=?
      WHERE id=?`,
      [
        title,
        description,
        technologies,
        image,
        github_link,
        live_link,
        live_demo,
        featured,
        category,
        req.params.id
      ]
    );

    res.json({ message: "Project updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ DELETE project
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM projects WHERE id = ?", [
      req.params.id,
    ]);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
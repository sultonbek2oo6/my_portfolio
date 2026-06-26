import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM admins WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Login yoki parol noto‘g‘ri" });
    }

    const admin = rows[0];
    const passwordMatches = await bcrypt.compare(password, admin.password).catch(() => false);

    if (!passwordMatches) {
      if (admin.password === password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("UPDATE admins SET password = ? WHERE id = ?", [hashedPassword, admin.id]);
      } else {
        return res.status(401).json({ success: false, message: "Login yoki parol noto‘g‘ri" });
      }
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/stats", verifyToken, async (req, res) => {
  try {
    const [[projects]] = await db.query("SELECT COUNT(*) as count FROM projects");
    const [[messages]] = await db.query("SELECT COUNT(*) as count FROM contacts");
    const [[skills]] = await db.query("SELECT COUNT(*) as count FROM skills");
    const [[experience]] = await db.query("SELECT COUNT(*) as count FROM experience");
    const [[education]] = await db.query("SELECT COUNT(*) as count FROM education");
    const [[my_story]] = await db.query("SELECT COUNT(*) as count FROM my_story");

    res.json({
      projects: projects.count,
      messages: messages.count,
      skills: skills.count,
      experience: experience.count,
      education: education.count,
      my_story: my_story.count,
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ error: "Stats error" });
  }
});

export default router;

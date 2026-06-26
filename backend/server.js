import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import fetch from "node-fetch";
import db from "./db.js";
import adminRoutes from "./routes/admin.js";
import { verifyToken } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const uploadDir = "./uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9.\-_.]/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({ storage });

// =====================
// MIDDLEWARE
// =====================
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      /\.vercel\.app$/ // Hamma Vercel havolalaridan keladigan so'rovlarga ruxsat beradi
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// =====================
// DEBUG LOG
// =====================
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// =====================
// TEST API
// =====================
app.get("/api", (req, res) => {
  res.json({ message: "API Working 🚀" });
});

app.post("/api/upload", verifyToken, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({ url, message: "File uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// =====================
// ADMIN ROUTES (LOGIN)
// =====================
app.use("/api/admin", adminRoutes);

// =====================
// PROJECTS CRUD
// =====================

// GET ALL PROJECTS
app.get("/api/projects", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM projects ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Projects fetch error" });
  }
});

app.get("/api/projects/:id", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Project fetch error" });
  }
});

// ADD PROJECT
app.post("/api/projects", verifyToken, async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      image,
      github_link,
      live_link,
      live_demo,
      featured,
      category,
    } = req.body;

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
        category,
      ]
    );

    res.json({ message: "Project created ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert error" });
  }
});

app.post("/api/contacts", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Invalid contact payload" });
    }

    const contactSubject = subject?.trim() || "Website Contact";

    await db.query(
      `INSERT INTO contacts (full_name, email, subject, message, is_read, created_at)
      VALUES (?, ?, ?, ?, 0, NOW())`,
      [name.trim(), email.trim(), contactSubject, message.trim()]
    );

    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const telegramMessage = `🔔 *Yangi Xabar (Portfolio)*\n\n👤 *Ism:* ${name.trim()}\n📧 *Email:* ${email.trim()}\n📝 *Mavzu:* ${contactSubject}\n\n${message.trim()}`;

      try {
        await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: telegramMessage,
              parse_mode: "Markdown",
            }),
          }
        );
      } catch (telegramError) {
        console.error("Telegram send error:", telegramError);
      }
    }

    res.json({ message: "Contact submitted" });
  } catch (err) {
    console.error("CONTACT ERROR:", err);
    res.status(500).json({ error: "Contact submit error" });
  }
});

// UPDATE PROJECT
app.put("/api/projects/:id", verifyToken, async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      image,
      github_link,
      live_link,
      live_demo,
      featured,
      category,
    } = req.body;

    await db.query(
      `UPDATE projects SET 
      title=?, description=?, technologies=?, image=?, github_link=?, live_link=?, live_demo=?, featured=?, category=?
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
        req.params.id,
      ]
    );

    res.json({ message: "Project updated ✅" });
  } catch (err) {
    res.status(500).json({ error: "Update error" });
  }
});
app.get("/api/settings", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM settings LIMIT 1");
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Settings fetch error" });
  }
});

app.put("/api/settings", verifyToken, async (req, res) => {
  try {
    const {
      site_name,
      site_logo,
      favicon,
      seo_title,
      seo_description,
      seo_keywords,
      theme_mode,
      contact_links,
    } = req.body;

    try {
      await db.query(
        `UPDATE settings SET 
          site_name=?, site_logo=?, favicon=?, 
          seo_title=?, seo_description=?, seo_keywords=?, theme_mode=?, contact_links=?
        WHERE id=1`,
        [
          site_name,
          site_logo,
          favicon,
          seo_title,
          seo_description,
          seo_keywords,
          theme_mode,
          JSON.stringify(contact_links || []),
        ]
      );
    } catch (updateErr) {
      if (updateErr.code === 'ER_BAD_FIELD_ERROR') {
        await db.query("ALTER TABLE settings ADD COLUMN IF NOT EXISTS contact_links TEXT");
        await db.query(
          `UPDATE settings SET 
            site_name=?, site_logo=?, favicon=?, 
            seo_title=?, seo_description=?, seo_keywords=?, theme_mode=?, contact_links=?
          WHERE id=1`,
          [
            site_name,
            site_logo,
            favicon,
            seo_title,
            seo_description,
            seo_keywords,
            theme_mode,
            JSON.stringify(contact_links || []),
          ]
        );
      } else {
        throw updateErr;
      }
    }

    res.json({ message: "Settings updated" });
  } catch (err) {
    res.status(500).json({ error: "Update error" });
  }
});
// DELETE PROJECT
app.delete("/api/projects/:id", verifyToken, async (req, res) => {
  try {
    await db.query("DELETE FROM projects WHERE id=?", [
      req.params.id,
    ]);

    res.json({ message: "Project deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: "Delete error" });
  }
});

// =====================// EDUCATION
// =====================
app.get("/api/education", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM education ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Education fetch error" });
  }
});

app.get("/api/education/:id", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM education WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Education item not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Education fetch error" });
  }
});

app.post("/api/education", verifyToken, async (req, res) => {
  try {
    const {
      institution_name,
      degree,
      field_of_study,
      start_year,
      end_year,
      description,
      image,
    } = req.body;

    await db.query(
      `INSERT INTO education 
      (institution_name, degree, field_of_study, start_year, end_year, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        institution_name,
        degree,
        field_of_study,
        start_year,
        end_year || null,
        description,
        image,
      ]
    );

    res.json({ message: "Education item added ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Add education error" });
  }
});

app.put("/api/education/:id", verifyToken, async (req, res) => {
  try {
    const {
      institution_name,
      degree,
      field_of_study,
      start_year,
      end_year,
      description,
      image,
    } = req.body;

    await db.query(
      `UPDATE education SET
        institution_name=?, degree=?, field_of_study=?, start_year=?, end_year=?, description=?, image=?
       WHERE id=?`,
      [
        institution_name,
        degree,
        field_of_study,
        start_year,
        end_year || null,
        description,
        image,
        req.params.id,
      ]
    );

    res.json({ message: "Education item updated ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update education error" });
  }
});

app.delete("/api/education/:id", verifyToken, async (req, res) => {
  try {
    await db.query("DELETE FROM education WHERE id=?", [req.params.id]);
    res.json({ message: "Education item deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: "Delete education error" });
  }
});

// =====================
// MY STORY
// =====================
app.get("/api/my_story", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM my_story ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "My story fetch error" });
  }
});

app.get("/api/my_story/:id", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM my_story WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "My story item not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "My story fetch error" });
  }
});

app.post("/api/my_story", verifyToken, async (req, res) => {
  try {
    const {
      title,
      place_name,
      city,
      country,
      description,
      image,
      visit_date,
      category,
    } = req.body;

    await db.query(
      `INSERT INTO my_story
      (title, place_name, city, country, description, image, visit_date, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        place_name,
        city,
        country,
        description,
        image,
        visit_date,
        category,
      ]
    );

    res.json({ message: "My story item added ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Add my story error" });
  }
});

app.put("/api/my_story/:id", verifyToken, async (req, res) => {
  try {
    const {
      title,
      place_name,
      city,
      country,
      description,
      image,
      visit_date,
      category,
    } = req.body;

    await db.query(
      `UPDATE my_story SET
        title=?, place_name=?, city=?, country=?, description=?, image=?, visit_date=?, category=?
       WHERE id=?`,
      [
        title,
        place_name,
        city,
        country,
        description,
        image,
        visit_date,
        category,
        req.params.id,
      ]
    );

    res.json({ message: "My story item updated ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update my story error" });
  }
});

app.delete("/api/my_story/:id", verifyToken, async (req, res) => {
  try {
    await db.query("DELETE FROM my_story WHERE id=?", [req.params.id]);
    res.json({ message: "My story item deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: "Delete my story error" });
  }
});

// =====================// CONTACTS (MESSAGES)
// =====================

// GET MESSAGES
app.get("/api/contacts", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM contacts ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Contacts fetch error" });
  }
});
app.put("/api/contacts/read/:id", verifyToken, async (req, res) => {
  try {
    await db.query(
      "UPDATE contacts SET is_read=1 WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Update error" });
  }
});

app.put("/api/contacts/reply/:id", verifyToken, async (req, res) => {
  try {
    const { reply } = req.body;

    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(400).json({ error: "Reply text required" });
    }

    await db.query(
      "UPDATE contacts SET reply=? WHERE id=?",
      [reply.trim(), req.params.id]
    );

    res.json({ message: "Reply saved" });
  } catch (err) {
    console.error("Reply error:", err);
    res.status(500).json({ error: "Reply save error" });
  }
});
app.delete("/api/contacts/:id", verifyToken, async (req, res) => {
  try {
    await db.query("DELETE FROM contacts WHERE id=?", [
      req.params.id,
    ]);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete error" });
  }
});
app.get("/api/contacts/unread/count", verifyToken, async (req, res) => {
  try {
    const [[row]] = await db.query(
      "SELECT COUNT(*) as count FROM contacts WHERE is_read=0"
    );

    res.json({ count: row.count });
  } catch (err) {
    res.status(500).json({ error: "Count error" });
  }
});

// =====================
// SKILLS
// =====================

app.get("/api/skills", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM skills ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Skills error" });
  }
});

app.get("/api/skills/:id", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM skills WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Skill fetch error" });
  }
});
app.post("/api/skills", verifyToken, async (req, res) => {
  try {
    const { name, percentage, icon, skill_level, category, sort_order } =
      req.body;

    await db.query(
      `INSERT INTO skills (name, percentage, icon, skill_level, category, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, percentage, icon, skill_level, category, sort_order]
    );

    res.json({ message: "Skill added ✅" });
  } catch (err) {
    res.status(500).json({ error: "Add skill error" });
  }
});
app.put("/api/skills/:id", verifyToken, async (req, res) => {
  try {
    const { name, percentage, icon, skill_level, category, sort_order } =
      req.body;

    await db.query(
      `UPDATE skills SET
        name=?, percentage=?, icon=?, skill_level=?, category=?, sort_order=?
       WHERE id=?`,
      [
        name,
        percentage,
        icon,
        skill_level,
        category,
        sort_order,
        req.params.id,
      ]
    );

    res.json({ message: "Skill updated ✅" });
  } catch (err) {
    res.status(500).json({ error: "Update skill error" });
  }
});
app.delete("/api/skills/:id", verifyToken, async (req, res) => {
  try {
    await db.query("DELETE FROM skills WHERE id=?", [req.params.id]);

    res.json({ message: "Skill deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: "Delete skill error" });
  }
});
// =====================
// EXPERIENCE
// =====================

app.get("/api/experience", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM experience ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Experience error" });
  }
});

app.get("/api/experience/:id", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM experience WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Experience not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Experience fetch error" });
  }
});
app.post("/api/experience", verifyToken, async (req, res) => {
  try {
    const {
      company_name,
      position_name,
      description,
      start_date,
      end_date,
      is_current,
    } = req.body;

    await db.query(
      `INSERT INTO experience
      (company_name, position_name, description, start_date, end_date, is_current)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        company_name,
        position_name,
        description,
        start_date,
        end_date,
        is_current,
      ]
    );

    res.json({ message: "Experience added ✅" });
  } catch (err) {
    res.status(500).json({ error: "Add experience error" });
  }
});
app.put("/api/experience/:id", verifyToken, async (req, res) => {
  try {
    const {
      company_name,
      position_name,
      description,
      start_date,
      end_date,
      is_current,
    } = req.body;

    await db.query(
      `UPDATE experience SET
        company_name=?, position_name=?, description=?, start_date=?, end_date=?, is_current=?
       WHERE id=?`,
      [
        company_name,
        position_name,
        description,
        start_date,
        end_date,
        is_current,
        req.params.id,
      ]
    );

    res.json({ message: "Experience updated ✅" });
  } catch (err) {
    res.status(500).json({ error: "Update experience error" });
  }
});
app.delete("/api/experience/:id", verifyToken, async (req, res) => {
  try {
    await db.query("DELETE FROM experience WHERE id=?", [
      req.params.id,
    ]);

    res.json({ message: "Experience deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: "Delete experience error" });
  }
});
// =====================
// Hero 
// =====================
app.get("/api/hero", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hero LIMIT 1");
    console.log("📊 Hero data from DB:", rows);
    
    if (rows.length === 0) {
      console.warn("⚠️ No hero data in database, returning defaults");
      return res.json({
        id: 1,
        full_name: "Sultonbek",
        title: "Full-Stack Developer & Systems Analyst",
        description: "Passionate Developer & Systems Analyst with a focus on innovation, building scalable and elegant web experiences using modern technologies.",
        hero_image: null,
        resume_file: null,
        button1_text: "View My Work",
        button1_link: "#projects",
        button2_text: "Get In Touch",
        button2_link: "#contact",
        availability_text: "Available for Freelance / Projects"
      });
    }
    
    // Ensure all fields are present even if null
    const heroData = {
      id: rows[0].id || 1,
      full_name: rows[0].full_name || "Sultonbek",
      title: rows[0].title || "Full-Stack Developer & Systems Analyst",
      description: rows[0].description || "Passionate Developer & Systems Analyst",
      hero_image: rows[0].hero_image || null,
      resume_file: rows[0].resume_file || null,
      button1_text: rows[0].button1_text || "View My Work",
      button1_link: rows[0].button1_link || "#projects",
      button2_text: rows[0].button2_text || "Get In Touch",
      button2_link: rows[0].button2_link || "#contact",
      availability_text: rows[0].availability_text || "Available for Freelance / Projects"
    };
    
    console.log("✅ Returning hero data:", heroData);
    res.json(heroData);
  } catch (err) {
    console.error("❌ Hero fetch error:", err);
    res.status(500).json({ error: "Hero fetch error" });
  }
});
app.put("/api/hero", verifyToken, async (req, res) => {
  try {
    const {
      full_name,
      title,
      description,
      hero_image,
      resume_file,
      button1_text,
      button1_link,
      button2_text,
      button2_link,
      availability_text,
    } = req.body;

    console.log("📝 Updating hero with:", { full_name, title, hero_image });

    // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both insert and update
    await db.query(
      `INSERT INTO hero (id, full_name, title, description, hero_image, resume_file, button1_text, button1_link, button2_text, button2_link, availability_text)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        full_name=?,
        title=?,
        description=?,
        hero_image=?,
        resume_file=?,
        button1_text=?,
        button1_link=?,
        button2_text=?,
        button2_link=?,
        availability_text=?`,
      [
        full_name,
        title,
        description,
        hero_image,
        resume_file,
        button1_text,
        button1_link,
        button2_text,
        button2_link,
        availability_text,
        // UPDATE values (same as INSERT)
        full_name,
        title,
        description,
        hero_image,
        resume_file,
        button1_text,
        button1_link,
        button2_text,
        button2_link,
        availability_text,
      ]
    );

    console.log("✅ Hero updated successfully");
    res.json({ message: "Hero updated ✅", success: true });
  } catch (err) {
    console.error("❌ Hero update error:", err);
    res.status(500).json({ error: "Hero update error", details: err.message });
  }
});

app.delete("/api/hero", verifyToken, async (req, res) => {
  try {
    console.log("🗑️ Deleting hero data...");
    
    await db.query(
      `DELETE FROM hero WHERE id=1`
    );

    console.log("✅ Hero deleted successfully");
    res.json({ message: "Hero deleted ✅", success: true });
  } catch (err) {
    console.error("❌ Hero delete error:", err);
    res.status(500).json({ error: "Hero delete error", details: err.message });
  }
});
// =====================
// DATABASE SCHEMA CHECK
// =====================
const ensureSettingsSchema = async () => {
  try {
    await db.query("ALTER TABLE settings ADD COLUMN contact_links TEXT");
    console.log("✅ Added contact_links column to settings table");
  } catch (err) {
    if (err.code === "ER_DUP_FIELDNAME" || err.errno === 1060) {
      return;
    }
    console.error("Schema ensure error:", err);
    throw err;
  }
};

const ensureHeroSchema = async () => {
  try {
    // Check if hero table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'hero'");
    if (tables.length === 0) {
      console.log("Creating hero table...");
      await db.query(`
        CREATE TABLE hero (
          id INT PRIMARY KEY AUTO_INCREMENT,
          full_name VARCHAR(255),
          title VARCHAR(255),
          description TEXT,
          hero_image VARCHAR(500),
          resume_file VARCHAR(500),
          button1_text VARCHAR(100),
          button1_link VARCHAR(255),
          button2_text VARCHAR(100),
          button2_link VARCHAR(255),
          availability_text VARCHAR(200),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log("✅ Hero table created");
      // Insert default data
      await db.query(`
        INSERT INTO hero (full_name, title, description, availability_text, button1_text, button1_link, button2_text, button2_link)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        "Sultonbek",
        "Full-Stack Developer & Systems Analyst",
        "Passionate Developer & Systems Analyst with a focus on innovation, building scalable and elegant web experiences using modern technologies.",
        "Available for Freelance / Projects",
        "View My Work",
        "#projects",
        "Get In Touch",
        "#contact"
      ]);
      console.log("✅ Default hero data inserted");
    } else {
      // Check if hero_image column exists
      const [columns] = await db.query("SHOW COLUMNS FROM hero WHERE Field='hero_image'");
      if (columns.length === 0) {
        console.log("Adding hero_image column...");
        await db.query("ALTER TABLE hero ADD COLUMN hero_image VARCHAR(500)");
        console.log("✅ Added hero_image column");
      }
      
      // Check if other required columns exist
      const requiredColumns = [
        'resume_file', 'button1_text', 'button1_link', 'button2_text', 
        'button2_link', 'availability_text'
      ];
      
      for (const col of requiredColumns) {
        const [col_exists] = await db.query(`SHOW COLUMNS FROM hero WHERE Field=?`, [col]);
        if (col_exists.length === 0) {
          console.log(`Adding ${col} column...`);
          await db.query(`ALTER TABLE hero ADD COLUMN ${col} VARCHAR(255)`);
          console.log(`✅ Added ${col} column`);
        }
      }
    }
  } catch (err) {
    console.error("Hero schema error:", err);
  }
};


// =====================
// START SERVER
// =====================
const startServer = async () => {
  await ensureSettingsSchema();
  await ensureHeroSchema();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
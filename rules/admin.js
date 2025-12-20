import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/**
 * ➕ CREATE (Register admin/moderator)
 * POST /api/admin/users
 */
router.post("/users", async (req, res) => {
  try {
    const { phone, password, role } = req.body;

    if (!phone || !password || !role) {
      return res.status(400).json({ message: "Ma'lumotlar to‘liq emas" });
    }

    if (!["admin", "moderator"].includes(role)) {
      return res.status(400).json({ message: "Role noto‘g‘ri" });
    }

    const exists = await User.findOne({ phone });
    if (exists) {
      return res.status(409).json({ message: "Bu telefon allaqachon mavjud" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      phone,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User yaratildi",
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
});

/**
 * 📥 READ (hammasini olish)
 * GET /api/admin/users
 */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
});

/**
 * 📄 READ (bitta user)
 * GET /api/admin/users/:id
 */
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User topilmadi" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
});

/**
 * ✏️ UPDATE (role yoki password)
 * PUT /api/admin/users/:id
 */
router.put("/users/:id", async (req, res) => {
  try {
    const { phone, password, role } = req.body;

    const updateData = {};

    if (phone) updateData.phone = phone;
    if (role) updateData.role = role;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User topilmadi" });
    }

    res.json({
      message: "User yangilandi",
      user
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
});

/**
 * 🗑 DELETE
 * DELETE /api/admin/users/:id
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User topilmadi" });
    }

    res.json({ message: "User o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
});

/**
 * 🔐 LOGIN (TOKENsiz)
 * POST /api/admin/login
 */
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User topilmadi" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Parol noto‘g‘ri" });
    }

    res.json({
      message: "Login muvaffaqiyatli",
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
});

export default router;

import User from "../models/User.js";
import bcrypt from "bcryptjs";

// LOGIN
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Ma’lumot to‘liq emas" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: "Telefon yoki parol noto‘g‘ri" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Telefon yoki parol noto‘g‘ri" });
    }

    res.json({
      user: {
        _id: user._id,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Ma’lumot to‘liq emas" });
    }

    const existUser = await User.findOne({ phone });
    if (existUser) {
      return res.status(409).json({ message: "Bu telefon bilan user mavjud" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      phone,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "User muvaffaqiyatli yaratildi",
      user: {
        _id: newUser._id,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
};

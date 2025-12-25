import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "ma’lumot to‘liq emas",
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({
        message: "Telefon yoki parol noto‘g‘ri",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Telefon yoki parol noto‘g‘ri",
      });
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

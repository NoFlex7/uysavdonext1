import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { phone, password, role } = req.body;

    // 1. Tekshiruv
    if (!phone || !password) {
      return res.status(400).json({
        message: "Ma’lumot to‘liq emas",
      });
    }

    // 2. User bor-yo‘qligini tekshirish
    const existUser = await User.findOne({ phone });
    if (existUser) {
      return res.status(409).json({
        message: "Bu telefon raqam bilan user mavjud",
      });
    }

    // 3. Parolni hash qilish
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. User yaratish
    const newUser = await User.create({
      phone,
      password: hashedPassword,
      role: role || "user",
    });

    // 5. Javob qaytarish
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

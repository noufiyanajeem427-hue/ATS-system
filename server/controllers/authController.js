import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

//(Register auth)
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   const user = await User.create({
  fullName,
  email,
  password: hashedPassword,
  role,
});

res.status(201).json({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  token: generateToken(user._id),
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// (login auth)
export const loginUser = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("PASSWORD ENTERED:", password);
    console.log("HASH IN DB:", user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email.",
      });
    }
   // Temporary reset token
  const resetToken = user._id;
  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    console.log("Reset Link:", resetLink);
    res.status(200).json({
      message: "Reset link generated successfully.",
      resetLink,
    });
    
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findById(token);

    if (!user) {
      return res.status(404).json({
        message: "Invalid or expired reset link.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password updated successfully.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
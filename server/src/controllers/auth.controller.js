import AuthModel from "../models/auth.model.js";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../services/email.service.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import callProcedure from "../config/callProcedure.js";
import bcrypt from "bcryptjs";
import { AppError } from "../middlewares/error.middleware.js";

// register controller
const register = async (req, res, next) => {
  try {
    const { user, token } = await AuthModel.register(req.body);
    await sendWelcomeEmail({ name: user.name, email: user.email });
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

// login controller
const login = async (req, res, next) => {
  try {
    const { user, token } = await AuthModel.login(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [rows] = await callProcedure("sp_CheckUserExists", [email]);
    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, we have sent a reset link.",
      });
    }

    const user = rows[0];
    const token = jwt.sign({ id: user.id }, env.jwt.secret, { expiresIn: '15m' });
    const resetUrl = `${env.client.url}/reset-password?token=${token}`;
    
    try {
      await sendPasswordResetEmail({ name: user.name, email: user.email, resetUrl });
    } catch (err) {
      console.error("Failed to send email, logging link instead:", resetUrl);
    }

    const data = env.server.isDev ? { resetUrl } : {};

    res.status(200).json({
      success: true,
      message: "If that email exists, we have sent a reset link.",
      data,
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwt.secret);
    } catch (err) {
      throw new AppError("Invalid or expired token", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await callProcedure("sp_UpdatePassword", [decoded.id, hashedPassword]);

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login.",
    });
  } catch (err) {
    next(err);
  }
};

export { register, login, forgotPassword, resetPassword };

import env from '../config/env.js';
import AuthModel from '../models/auth.model.js';
import {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from '../services/email.service.js';

// register controller
const register = async (req, res, next) => {
  try {
    const { user, token } = await AuthModel.register(req.body);
    try {
      await sendWelcomeEmail({
        userId: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (emailErr) {
      console.error('[Registration] Welcome email sending failed:', emailErr);
    }
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
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
      message: 'Login successful',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await AuthModel.forgotPassword({ email });
    const { user, resetUrl } = result;

    try {
      await sendPasswordResetEmail({
        userId: user.id,
        name: user.name,
        email: user.email,
        resetUrl,
      });
    } catch (err) {
      console.error('Failed to send email, logging link instead:', resetUrl);
      console.error('[Forgot Password] Email sending error details:', err);
    }

    const data = env.server.isDev ? { resetUrl } : {};

    res.status(200).json({
      success: true,
      message: 'If that email exists, we have sent a reset link.',
      data,
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const result = await AuthModel.resetPassword({ token, password });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const result = await AuthModel.changePassword({
      currentPassword,
      newPassword,
      confirmPassword,
      ...req.user,
    });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

export { changePassword, forgotPassword, login, register, resetPassword };

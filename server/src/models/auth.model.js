import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import callProcedure from '../config/callProcedure.js';
import env from '../config/env.js';
import { AppError } from '../middlewares/error.middleware.js';

//sign token
const signToken = (payload) =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

// auth model
const AuthModel = {
  // create user
  register: async ({ name, email, password, role }) => {
    const existingUser = await callProcedure('sp_CheckUserExists', [email]);
    if (existingUser[0].length > 0) {
      throw new AppError('User already exists', 409);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const rows = await callProcedure('sp_CreateUser', [
      name,
      email,
      hashedPassword,
      role,
    ]);

    const token = signToken({ id: rows[0].id });

    return { user: rows[0][0], token };
  },

  //login user
  login: async ({ email, password }) => {
    const [rows] = await callProcedure('sp_CheckUserExists', [email]);
    if (rows.length === 0) throw new AppError('Email is not registered', 401);

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new AppError('Invalid password', 401);

    // sign token
    const token = signToken({ id: user.id });

    return { user, token };
  },

  //change password
  changePassword: async ({
    currentPassword,
    newPassword,
    confirmPassword,
    id,
    email,
  }) => {
    const [rows] = await callProcedure('sp_CheckUserExists', [email]);

    if (!rows || rows.length === 0) throw new AppError('User not found', 404);

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) throw new AppError('Invalid current password', 400);

    if (newPassword !== confirmPassword) {
      throw new AppError('New password and confirm password do not match', 400);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await callProcedure('sp_ChangePassword', [
      id,
      user.password,
      hashedNewPassword,
      hashedNewPassword,
    ]);

    return { message: 'Password changed successfully' };
  },

  //forget password
  forgotPassword: async ({ email }) => {
    const [rows] = await callProcedure('sp_CheckUserExists', [email]);

    if (rows.length === 0) {
      throw new AppError('Email is not registered', 401);
    }

    const user = rows[0];
    const token = jwt.sign({ id: user.id }, env.jwt.secret, {
      expiresIn: '15m',
    });
    const resetUrl = `${env.client.url}/reset-password?token=${token}`;

    return { user, resetUrl };
  },

  //reset password
  resetPassword: async ({ token, password }) => {
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwt.secret);
    } catch {
      throw new AppError('Invalid or expired token', 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await callProcedure('sp_UpdatePassword', [decoded.id, hashedPassword]);
    return { message: 'Password reset successful. You can now login.' };
  },
};

export default AuthModel;

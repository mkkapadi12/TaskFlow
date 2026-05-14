import env from "../config/env.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppError } from "../middlewares/error.middleware.js";
import callProcedure from "../config/callProcedure.js";

//sign token
const signToken = (payload) =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

// auth model
const AuthModel = {
  // create user
  register: async ({ name, email, password, role }) => {
    const existingUser = await callProcedure("sp_CheckUserExists", [email]);
    if (existingUser[0].length > 0) {
      throw new AppError("User already exists", 409);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const rows = await callProcedure("sp_CreateUser", [
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
    const [rows] = await callProcedure("sp_CheckUserExists", [email]);
    if (rows.length === 0) throw new AppError("Email is not registered", 401);

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new AppError("Invalid password", 401);

    // sign token
    const token = signToken({ id: user.id });

    return { user, token };
  },
};

export default AuthModel;

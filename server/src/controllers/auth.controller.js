import AuthModel from "../models/auth.model.js";

// register controller
const register = async (req, res, next) => {
  try {
    const { user, token } = await AuthModel.register(req.body);
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

export { register, login };

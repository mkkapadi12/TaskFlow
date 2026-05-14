import UserModel from "../models/user.model.js";

const getAllUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const users = await UserModel.getAll({ search });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const getProfile = (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await UserModel.update({
      id: req.user.id,
      body: req.body,
      file: req.file,
    });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
const deleteUser = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export { getProfile, updateProfile, deleteUser, getAllUsers };

import UserModel from '../models/user.model.js';

const getAllUsers = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const users = await UserModel.getAll({ search });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.getUserById({ id: req.params.id });
    res.status(200).json({ success: true, user });
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
      message: 'Update successfully',
    });
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await UserModel.delete({ id: req.params.id });
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};

export { deleteUser, getAllUsers, getProfile, getUserById, updateProfile };

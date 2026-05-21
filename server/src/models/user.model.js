import callProcedure from '../config/callProcedure.js';
import cloudinary from '../config/cloudinary.js';
import { AppError } from '../middlewares/error.middleware.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';

const UserModel = {
  getAll: async ({ search = '' }) => {
    const [users] = await callProcedure('sp_SearchUser', [search]);

    if (users.length == 0) throw new AppError('No users found', 404);

    return users;
  },

  getUserById: async ({ id }) => {
    const [user] = await callProcedure('sp_GetUserById', [id]);

    if (!user[0]) throw new AppError('User not found', 404);

    return user[0];
  },

  update: async ({ id, body, file }) => {
    const existuser = await callProcedure('sp_GetUserById', [id]);

    if (!existuser) throw new AppError('User not found', 404);
    const user = existuser[0][0];

    const { name, phone } = body;

    let avatar = existuser.avatar;
    let publicId = existuser.publicId;

    if (file) {
      if (existuser.publicId) {
        await cloudinary.v2.uploader.destroy(user.publicId);
      }
      const uploaded = await uploadToCloudinary(file.buffer);
      avatar = uploaded.secure_url;
      publicId = uploaded.public_id;
    }

    const updatedUser = await callProcedure('sp_UpdateUser', [
      id,
      name,
      avatar,
      publicId,
      phone,
    ]);

    return updatedUser[0][0];
  },
  delete: async ({ id }) => {
    const user = await callProcedure('sp_GetUserById', [id]);

    if (!user[0]) throw new AppError('User not found', 404);

    if (user[0].publicId) {
      await cloudinary.v2.uploader.destroy(user[0].publicId);
    }
    const deletedUser = await callProcedure('sp_DeleteUser', [id]);

    return deletedUser[0][0];
  },
};

export default UserModel;

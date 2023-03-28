const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { id: _id } = req.params;
  const user = await User.findOne({ _id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No User with id: ${_id}`);
  }
  checkPermissions(req.user, user._id)

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const user = User.findOne({_id:req.user.userId}).select("-password")
  res.status(StatusCodes.OK).json({ user });
};


const updateUser = async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
      throw new CustomError.BadRequestError("Please provide all values");
    }
  
    const user = await User.findOne(
      { _id: req.user.userId },
    );
    user.email = email;
    user.name = name;
    await user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res, tokenUser});
    res.status(StatusCodes.OK).json({user:tokenUser})
  
  };
  
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please peovide old password and new password"
    );
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentilas");
  }
  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

//With findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new CustomError.BadRequestError("Please provide all values");
//   }

//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({res, tokenUser});
//   res.status(StatusCodes.OK).json({user:tokenUser})

// };
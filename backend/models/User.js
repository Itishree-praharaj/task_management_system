import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "First name is required" },
        len: {
          args: [2, 50],
          msg: "First name must be between 2 and 50 characters",
        },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Last name is required" },
        len: {
          args: [2, 50],
          msg: "Last name must be between 2 and 50 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email must be unique",
      },
      validate: {
        isEmail: {
          msg: "Please enter a valid email address",
        },
        notEmpty: {
          msg: "Email is required",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password is required" },
        len: {
          args: [8, 255],
          msg: "Password must be at least 8 characters long",
        },
      },
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
  },
  {
    timestamps: true,
  }
);

export default User;

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 100],
        msg: "Task title must be between 3 and 100 characters",
      },
    },
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("To Do", "In Progress", "Done"),
    allowNull: false,
    defaultValue: "To Do",
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM("Low", "Medium", "High"),
    defaultValue: "Medium",
  },
}, {
  timestamps: true,
});

export default Task;

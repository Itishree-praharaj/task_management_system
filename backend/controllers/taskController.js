import taskModel from "../models/Task.js";

const getTasks = async (req, res) => {
  try {
    const tasks = await taskModel.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createTask = async (req, res) => {
  try {
    const newTask = await taskModel.create(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const updateTask = async (req, res) => {
  const { id } = req.params;
  console.log("Updating task with ID:", id); // ⬅️ Debug log

  try {
    const [updated] = await taskModel.update(req.body, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await taskModel.findByPk(id);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await taskModel.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const reorderTasks = async (req, res) => {
  const { tasks } = req.body;
  try {
    for (let task of tasks) {
      await taskModel.update(
        { status: task.status },
        { where: { id: task.id } }
      );
    }
    res.status(200).json({ message: "Tasks reordered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export { getTasks, createTask, updateTask, deleteTask, reorderTasks };

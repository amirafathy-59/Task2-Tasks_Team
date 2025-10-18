import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { deleteOne } from "../handlers/factor.handler.js";
import { taskModel } from "../../../DB/models/task.model.js";
import { teamMemberModel } from "../../../DB/models/teamMember.model.js";

// GET /api/tasks
export const getAllTasks = async (req, res) => {
  const tasks = await taskModel.find()
  res.json(tasks);
};

// GET /api/tasks/:id
export const getTaskById = async (req, res) => {
  const task = await taskModel.findById(req.params.id).populate("memberIds", "name email");
  if (!task) return res.status(404).json({ message: "Record not found" });
  res.json(task);
};

// POST /api/tasks

export const createTask = async (req, res) => {
  const { name,description, startDate,endDate } = req.body;
    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and Description are required." });
    }
    try {
      const task = new taskModel({ name,description, startDate,endDate });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  res.status(201).json(task);
};

// PUT /api/tasks/:id
// export const updateTask = async (req, res, next) => {
//   const { name, description, startDate, endDate, memberId } = req.body;
//   const { id } = req.params;

//   try {
//     if (memberId) {
//       const memberExists = await teamMemberModel.findById(memberId);
//       if (!memberExists) {
//        return res.status(404).json({ message: `Team member not found with ID ${memberId}` });
//       }
//     }

//     const updatedTask = await taskModel.findByIdAndUpdate(
//       id,
//       { name, description, startDate, endDate, memberId },
//       { new: true, runValidators: true }
//     );

//     if (!updatedTask) return next(new AppError(`Task not found with ID ${id}`, 404));

//     res.status(200).json({ message: "success", updatedTask });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, startDate, endDate, memberId } = req.body;

  try {
    const updateFields = { name, description, startDate, endDate };

    if (memberId) {
      const memberExists = await teamMemberModel.findById(memberId);
      if (!memberExists) {
        return res.status(404).json({ message: `Team member not found with ID ${memberId}` });
      }
      await taskModel.findByIdAndUpdate(id, {
        $addToSet: { memberIds: memberId }
      });
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedTask) return next(new AppError(`Task not found with ID ${id}`, 404));

    res.status(200).json({ message: "success", updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getTasksByMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (memberId) {
      const memberExists = await teamMemberModel.findById(memberId);
      if (!memberExists) {
        return res.status(404).json({ message: `Team member not found with ID ${memberId}` });
       // return next(new AppError(`Team member not found with ID ${memberId}`, 404));
      }
    }

   // const tasks = await taskModel.find({ memberId }).populate("memberId", "name email");
       const tasks = await taskModel
      .find({ memberIds: memberId }) // ← changed from memberId to memberIds
      .populate("memberIds", "name email");

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks assigned to this member." });
    }

    res.status(200).json({ count: tasks.length, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// DELETE /api/tasks/:id
export const deleteTask = deleteOne(taskModel);

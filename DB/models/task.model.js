import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },
  startDate: { type: Date },
  endDate: { type: Date },
  // memberId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "teamMember",
  //   required: false
  // }
  memberIds: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teamMember"
  }
]
});

export const taskModel = mongoose.model("task", taskSchema);

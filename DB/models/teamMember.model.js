import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // basic email regex
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  //  tasks: [
  //     {
  //       taskId: { type: mongoose.Schema.Types.ObjectId, ref: "task" }
  //     },
  //   ],

});

export const teamMemberModel = mongoose.model("teamMember", teamMemberSchema);

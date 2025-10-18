import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { teamMemberModel } from "../../../DB/models/teamMember.model.js";


export const createMember = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  console.log(req.body);
  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "Name and Email are required." });
  }
  try {
    const newMember = new teamMemberModel({ name, email });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get all members
 export const getAllMembers = catchAsyncError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(teamMemberModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();

  const members = await apiFeatures.mongooseQuery;

  res
    .status(200)
    .json({ message: "success", page: apiFeatures.page, members });
});
// get member
export const getMember = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await teamMemberModel.findById(id);

  !result && next(new AppError(`Record not found`), 404);
  result && res.status(200).json({ message: "success", result });
});
// update member
export const updateMember = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  const { id } = req.params;
  try {
    const updatedMember = await teamMemberModel.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );

    !updatedMember && next(new AppError(`Record not found`), 404);
    updatedMember && res.status(200).json({ message: "success", updatedMember });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// delete member
export const deleteMember = deleteOne(teamMemberModel);

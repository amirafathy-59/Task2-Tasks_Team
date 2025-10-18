import { globalErrorHandling } from "../middleware/globalErrorHandling.js";
import { AppError } from "../utils/AppError.js";
import memberRouter from "./member/member.router.js";
import taskRouter from "./task/task.router.js";

export function init(app) {
  app.use("/api/v1/tasks", taskRouter);
  app.use("/api/v1/members", memberRouter);
  //     app.all('*', (req, res, next) => {
  //         next(new AppError(`can't find this route: ${req.originalUrl}`), 404)
  //     })
  //     //global error handling middleware
  //     app.use(globalErrorHandling)
}

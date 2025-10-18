
import express from "express"
import * as task from "./task.controller.js"
const taskRouter = express.Router()

taskRouter
    .route('/')
    .post(task.createTask)
    .get(task.getAllTasks)

taskRouter
    .route('/:id')
    .get(task.getTaskById)
    .put(task.updateTask)
    .delete(task.deleteTask)

taskRouter.route("/member/:memberId").get(task.getTasksByMember);  

export default taskRouter



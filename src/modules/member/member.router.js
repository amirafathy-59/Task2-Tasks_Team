
import express from "express"
import * as member from "./member.controller.js"

const memberRouter = express.Router()
memberRouter
    .route('/')
    .post(member.createMember)
    .get(member.getAllMembers)

memberRouter
    .route('/:id')
    .get(member.getMember)
    .put(member.updateMember)
    .delete(member.deleteMember)


export default memberRouter



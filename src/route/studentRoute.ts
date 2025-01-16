import express from "express";
import { authenticateUser } from "../middleware/authentication";
import {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
} from "../controller/studentController";

const Router = express.Router();

Router.route("/")
  .post(authenticateUser, createStudent)
  .get(authenticateUser, getAllStudents);

Router.route("/:id")
  .get(authenticateUser, getSingleStudent)
  .patch(authenticateUser, updateStudent);

export default Router;

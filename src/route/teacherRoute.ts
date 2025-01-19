import express from "express";
import {
  createTeacher,
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
} from "../controller/teachersController";
import { authenticateUser } from "../middleware/authentication";

const Route = express.Router();

Route.route("/")
  .post(authenticateUser, createTeacher)
  .get(authenticateUser, getAllTeachers);

Route.route("/:id")
  .get(authenticateUser, getSingleTeacher)
  .patch(authenticateUser, updateTeacher);

export default Route;

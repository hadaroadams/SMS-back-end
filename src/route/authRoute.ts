import express from "express";
import { login, logout, register } from "../controller/authController";
import { authenticateUser } from "../middleware/authentication";

const Router = express.Router();

Router.post("/register", register);
Router.post("/login", login);
Router.delete("/logout", authenticateUser, logout);

export default Router;

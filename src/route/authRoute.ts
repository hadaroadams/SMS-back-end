import express from "express";
import { login, logout, register } from "../controller/authController";

const Route = express.Router();

Route.post("/register", register);
Route.post("/login", login);
Route.get("/logout", logout);

export default Route;

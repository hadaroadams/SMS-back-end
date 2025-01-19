import { Request, Response } from "express";
import { prisma } from "../config/dbConnect";
import { StatusCodes } from "http-status-codes";

export const createTeacher = async (req: Request, res: Response) => {
  const {
    id,
    firstName,
    lastName,
    dateOfBir,
    gender,
    email,
    phone,
    street,
    city,
    state,
    zipCode,
    hireDate,
    subjects,
    salary,
    createdAt,
    updatedAt,
  } = req.body;

  const teacher = await prisma.teacher.create({ data: { ...req.body } });
  res.status(StatusCodes.CREATED).json({ teacher });
};

export const getAllTeachers = async (req: Request, res: Response) => {
  const teachers = await prisma.teacher.findMany();

  res.status(StatusCodes.OK).json({ teachers, count: teachers.length });
};

export const getSingleTeacher = async (req: Request, res: Response) => {
  const { id: teacherId } = req.params;
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
  });

  res.status(StatusCodes.OK).json({ teacher });
};

export const updateTeacher = async (req: Request, res: Response) => {
  const { id: teacherId } = req.params;
  const teacher = await prisma.teacher.update({
    data: { ...req.body },
    where: { id: teacherId },
  });

  res.status(StatusCodes.OK).json({ teacher });
};

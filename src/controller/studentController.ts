import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/dbConnect";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors";

export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    email,
    phone,
    street,
    city,
    state,
    zipCode,
  } = req.body;

  try {
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        email,
        phone,
        street,
        city,
        state,
        zipCode,
      },
    });
    res.status(StatusCodes.CREATED).json({ student });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const students = await prisma.student.findMany();
  res.status(StatusCodes.OK).json({ students, count: students.length });
};

export const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: studentId } = req.params;
  const student = await prisma.student.findUnique({ where: { id: studentId } });

  res.status(StatusCodes.OK).json({ student });
};

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: studentId } = req.params;

  const isStudentExisting = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!isStudentExisting)
    return next(new NotFound(`Nos student with id ${studentId} `));

  const student = await prisma.student.update({
    data: { ...req.body },
    where: { id: studentId },
  });

  res.status(StatusCodes.OK).json({ student });
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};

export { prisma, connectDB };

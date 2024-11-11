"use server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { db } from "@/db/drizzel";
import { users } from "@/db/usersSchema";
import { passwordMatchSchema } from "@/validation/passwordMatch";

type RegisterData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const registeruser = async ({
  confirmPassword,
  email,
  password,
}: RegisterData) => {
  const newUserSchema = z
    .object({
      email: z.string().email(),
    })
    .and(passwordMatchSchema);

  const newUserValidation = newUserSchema.safeParse({
    email,
    password,
    confirmPassword,
  });

  if (!newUserValidation.success) {
    return {
      error: true,
      message:
        newUserValidation.error.errors[0]?.message ?? "An error occurred",
    };
  }

  const hashedPassword = await hash(password, 10);

  await db.insert(users).values({
    email,
    password: hashedPassword,
  });
};

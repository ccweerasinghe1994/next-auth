"use server";

import { passwordMatchSchema } from "@/validation/passwordMatch";
import { z } from "zod";

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
};

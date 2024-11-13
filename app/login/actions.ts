"user server";
import { passwordSchema } from "@/validation/passwordSchema";
import { z } from "zod";

type LoginData = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: LoginData) => {
  const loginSchema = z.object({
    email: z.string().trim().email({ message: "Invalid email address" }),
    password: passwordSchema,
  });

  const loginValidation = loginSchema.safeParse({ email, password });

  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error.errors[0]?.message ?? "An error occurred",
    };
  }
};

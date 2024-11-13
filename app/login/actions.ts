"user server";
import { signIn } from "@/auth";
import { emailSchema } from "@/validation/emailSchema";
import { passwordSchema } from "@/validation/passwordSchema";
import { z } from "zod";

type LoginData = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: LoginData) => {
  const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  const loginValidation = loginSchema.safeParse({ email, password });

  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error.errors[0]?.message ?? "An error occurred",
    };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {}
};

import { z } from "zod";
import { passwordConfirmSchema } from "./passwordConfirmSchema";
import { passwordSchema } from "./passwordSchema";

export const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordConfirmSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

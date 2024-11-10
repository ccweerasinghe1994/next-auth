
import { z } from "zod";

export const passwordConfirmSchema = z.string().min(6, {
  message: "Confirm Password must be at least 6 characters long",
});
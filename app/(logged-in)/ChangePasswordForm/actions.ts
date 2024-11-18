"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzel";
import { users } from "@/db/usersSchema";
import { passwordMatchSchema } from "@/validation/passwordMatch";
import { passwordSchema } from "@/validation/passwordSchema";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

type TChangePasswordData = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

export const changePassword = async (data: TChangePasswordData) => {
  const session = await auth();
  console.log("session", session);

  if (!session?.user?.id) {
    return {
      error: true,
      message: "You must be logged in to change your password",
    };
  }

  const dataSchema = z
    .object({
      currentPassword: passwordSchema,
    })
    .and(passwordMatchSchema);

  const validatedData = dataSchema.safeParse(data);

  if (validatedData.error) {
    return {
      error: true,
      message: validatedData?.error?.errors[0]?.message ?? "An error occurred",
    };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }
  console.log("user", user);

  const passwordMatch = await compare(data.currentPassword, user.password!);

  if (!passwordMatch) {
    return {
      error: true,
      message: "Current password is incorrect",
    };
  }

  const hashPassword = await hash(data.password, 10);

  await db
    .update(users)
    .set({
      password: hashPassword,
    })
    .where(eq(users.id, parseInt(session.user.id)));
};

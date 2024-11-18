"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzel";
import { passwordResetTokens } from "@/db/passwordResetTokensSchema";
import { users } from "@/db/usersSchema";
import { passwordMatchSchema } from "@/validation/passwordMatch";
import { hash } from "bcryptjs";
import { log } from "console";
import { eq } from "drizzle-orm";

type TUpdatePassword = {
  token: string;
  password: string;
  confirmPassword: string;
};

export const updatePassword = async ({
  token,
  password,
  confirmPassword,
}: TUpdatePassword) => {
  const passwordValidation = passwordMatchSchema.safeParse({
    password,
    confirmPassword,
  });

  if (!passwordValidation.success) {
    return {
      error: true,
      message:
        passwordValidation.error.issues[0].message ?? "An error occurred",
    };
  }

  const session = await auth();
  let tokenIsValid = false;

  if (!!session?.user?.id) {
    return {
      error: true,
      message:
        "You are already logged in please log out to reset your password",
    };
  }
  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    const now = Date.now();
    if (
      !!passwordResetToken?.tokenExpiry &&
      passwordResetToken.tokenExpiry.getTime() > now
    ) {
      tokenIsValid = true;
    }

    if (!tokenIsValid) {
      return {
        error: true,
        message: "Your password reset link is invalid or expired",
        tokenInvalid: true,
      };
    }

    const hashedPassword = await hash(password, 10);

    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, passwordResetToken.userId!));

    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
  }
};

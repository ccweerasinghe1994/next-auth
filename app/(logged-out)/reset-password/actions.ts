"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzel";
import { passwordResetTokens } from "@/db/passwordResetTokensSchema";
import { users } from "@/db/usersSchema";
import { mailer } from "@/lib/email";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

export const passwordReset = async ({ email }: { email: string }) => {
  const session = await auth();

  if (!!session?.user?.id) {
    return {
      error: true,
      message: "You are already logged in",
    };
  }

  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    return;
  }

  const passwordResetToken = randomBytes(32).toString("hex");

  const tokenExpiry = new Date(Date.now() + 3600000);

  await db
    .insert(passwordResetTokens)
    .values({
      userId: user.id,
      token: passwordResetToken,
      tokenExpiry,
    })
    .onConflictDoUpdate({
      target: passwordResetTokens.userId,
      set: {
        token: passwordResetToken,
        tokenExpiry,
      },
    });
  const resetLink = `${process.env.BASE_URL}/update-password?token=${passwordResetToken}`;

  await mailer.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset Request",
    html: `
    Hey ${email}! you requested to reset your password.
    Here's your password reset link: <a href="${resetLink}">${resetLink}</a>
    this link will expire in 1 hour.
    `,
  });
};

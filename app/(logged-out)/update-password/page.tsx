import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/drizzel";
import { passwordResetTokens } from "@/db/passwordResetTokensSchema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import PasswordResetForm from "./PasswordResetForm/PasswordResetForm";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
  }>;
}) {
  let tokenIsValid = false;
  const { token } = await searchParams;

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

    // Check if token is valid
  }
  return (
    <main className="min-h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            {tokenIsValid
              ? "Update Password"
              : "Your password reset link is invalid or expired"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tokenIsValid ? (
            <PasswordResetForm token={token ?? ""} />
          ) : (
            <Link className="underline" href={"/reset-password"}>
              {" "}
              Request another password reset link{" "}
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

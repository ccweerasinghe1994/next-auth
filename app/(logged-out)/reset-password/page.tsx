"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailSchema } from "@/validation/emailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { passwordReset } from "./actions";

const formSchema = z.object({
  email: emailSchema,
});

export default function ResetPasswordPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await passwordReset(data);
  };

  return (
    <main className="min-h-screen flex justify-center items-center">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>Email Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              If an account with {form.getValues("email")} email exists, we sent
              you an email with instructions on how to reset your password
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Password Reset</CardTitle>
            <CardDescription>
              Enter your email address to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="flex flex-col gap-2"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!!form.formState.errors.root?.message && (
                    <FormMessage>
                      {form.formState.errors.root?.message}
                    </FormMessage>
                  )}
                  <Button type="submit">Reset Password</Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-muted-foreground flex flex-col gap-2 text-sm">
            <div>
              Remember your password?{" "}
              <Link className="underline" href="/login">
                Login
              </Link>
            </div>
            <div>
              Don&apos;t have an account?
              <Link href="/register" className="underline">
                {" "}
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}

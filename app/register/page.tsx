"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { passwordMatchSchema } from "@/validation/passwordMatch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { z } from "zod";
import { registeruser } from "./actions";

const formSchema = z
  .object({
    email: z.string().trim().email({ message: "Invalid email address" }),
  })
  .and(passwordMatchSchema);

export default function RegisterPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await registeruser({ ...data });

    if (response?.error) {
      form.setError("email", {
        message: response.message,
      });
    }

    console.log(response);
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[380px] ">
          <CardHeader>
            <CardTitle>Success</CardTitle>
            <CardDescription>
              You have successfully registered for a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-[380px] ">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Register for a new account</CardDescription>
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

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Register</Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

"use client";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {passwordSchema} from "@/validation/passwordSchema";
import {Button} from "@/components/ui/button";

export default function Login() {

    const formSchema = z.object({
        email: z.string().trim().email({message: 'Invalid email address'}),
        password: passwordSchema
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    }

    return (
        <main className={'flex min-h-screen justify-center items-center'}>
            <Card className={'w-[380px]'}>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Login in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <fieldset className={'flex flex-col gap-2'} disabled={form.formState.isSubmitting}>
                                <FormField
                                    control={form.control}
                                    name={'email'}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} type={'email'}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField control={form.control} render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type={'password'}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )} name={"password"}/>

                                <Button type={'submit'} className={'w-full'}>Login</Button>
                            </fieldset>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    )
};
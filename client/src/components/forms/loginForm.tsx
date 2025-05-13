"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SignInFormSchema } from "~/zod/formSchema";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useSession } from "~/hooks/useSession";
import { SignIn } from "~/lib/auth";

export default function SignInForm() {
  const router = useRouter();
  const { refresh } = useSession();
  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof SignInFormSchema>) {
    const postForm = new FormData();

    postForm.append("email", data.email);
    postForm.append("password", data.password);

    const res = await SignIn(postForm);

    if (res.status === 200) {
      form.reset();

      if (res.redirect) {
        router.push(res.redirect);
      }
    } else {
      // TODO: handle Error UI
      if (res.status === 409) {
        form.setError("email", {
          message: "User with this email already exists",
        });
      }
      if (res.status === 400) {
        alert(res.message);
      } else {
        alert("Something went wrong");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Email" type="email" {...field} />
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
                <Input
                  placeholder="Enter your Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full text-lg" size={"lg"} type="submit">
          Sign In
        </Button>
      </form>
    </Form>
  );
}

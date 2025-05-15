"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SignUpFormSchema } from "~/zod/formSchema";
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

export default function SignUpForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof SignUpFormSchema>) {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      return;
    }

    const postForm = new FormData();

    postForm.append("name", data.name);
    postForm.append("email", data.email);
    postForm.append("password", data.password);

    console.log(data);

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      body: postForm,
      credentials: "include",
    });

    if (res.ok) {
      form.reset();
      router.push("/auth/login");
    } else {
      // TODO: handle Error UI
      if (res.status === 409) {
        form.setError("email", {
          message: "User with this email already exists",
        });
      }
      if (res.status === 400) {
        alert(await res.text());
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="Use a strong password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters long.
              </FormDescription>
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
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full text-lg" size={"lg"} type="submit">
          Create Account
        </Button>
      </form>
    </Form>
  );
}

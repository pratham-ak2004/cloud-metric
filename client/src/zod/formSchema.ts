import { z } from "zod";

export const SignUpFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
});

export const SignInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

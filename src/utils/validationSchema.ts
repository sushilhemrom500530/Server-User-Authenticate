import { z } from 'zod';

export const Signup = z.object({
  username: z.string({required_error:"User name is required"}).min(3, "Username must be at least 3 characters long"),
  password: z
    .string({required_error:"Password is required"})
    .min(8, "Password must be at least 8 characters long")
    .regex(/(?=.*\d)(?=.*[@$!%*?&])/, "Password must include at least one number and one special character"),
  shops: z
    .array(z.string({required_error:"Shops is required"}).min(1, "Shop name cannot be empty"))
    .min(3, "At least 3 shop names are required")
    .max(4, "Maximum 4 shops allowed"),
});

export const Signin = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export const ValidationSchema = {
    Signup,
    Signin
}
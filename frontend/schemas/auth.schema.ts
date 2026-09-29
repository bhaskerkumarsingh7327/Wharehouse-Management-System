import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email required hai").email("Sahi email daalo"),
  password: z.string().min(1, "Password required hai"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Naam kam se kam 2 characters ka ho"),
    email: z.string().min(1, "Email required hai").email("Sahi email daalo"),
    password: z.string().min(8, "Password kam se kam 8 characters ka ho"),
    confirmPassword: z.string().min(1, "Password confirm karo"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Dono passwords match nahi karte",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email required hai").email("Sahi email daalo"),
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP 6 digits ka hota hai").regex(/^\d+$/, "Sirf numbers daalo"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password kam se kam 8 characters ka ho"),
    confirmPassword: z.string().min(1, "Password confirm karo"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Dono passwords match nahi karte",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

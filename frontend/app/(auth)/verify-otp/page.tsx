"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyOtpSchema, type VerifyOtpInput } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { resetFlow } from "@/lib/reset-flow";
import { getErrorMessage } from "@/lib/api";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  // Email ke bina is page ka koi matlab nahi
  useEffect(() => {
    const saved = resetFlow.getEmail();
    if (!saved) router.replace("/forgot-password");
    else setEmail(saved);
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async ({ otp }: VerifyOtpInput) => {
    if (!email) return;
    setSubmitting(true);
    try {
      const { resetToken } = await authService.verifyOtp(email, otp);
      resetFlow.setToken(resetToken);
      toast.success("OTP verify ho gaya");
      router.push("/reset-password");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await authService.forgotPassword(email);
      toast.success("Naya OTP bhej diya gaya");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setResending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify OTP</CardTitle>
        <CardDescription>
          {email ? `${email} par bheja gaya 6 digit OTP daalo` : "Loading..."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              autoComplete="one-time-code"
              className="text-center text-lg tracking-widest"
              {...register("otp")}
            />
            {errors.otp && (
              <p className="text-sm text-destructive">{errors.otp.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={submitting || !email}>
            {submitting ? "Verifying..." : "Verify OTP"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onResend}
            disabled={resending || !email}
          >
            {resending ? "Sending..." : "OTP dobara bhejo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
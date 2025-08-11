"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  // const router = useRouter();
  const { status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const res = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    if (res?.error) {
      console.log(res.error);
    } else if (res?.ok) {
      window.location.href = res.url || "/dashboard";
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input {...register("username")} />
          {errors.username && <span>{errors.username.message}</span>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input {...register("password")} />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}

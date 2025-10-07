"use client";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type LoginFormData = {
  email: string;
  password: string;
};
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isPassword, setIsPassword] = React.useState<boolean>(true);
  const [isPending, startTransition] = React.useTransition();
  const [formData, setFormData] = React.useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData({ email: "", password: "" });
    startTransition(async () => {
      // const res = await loginAction(formData);
      // if (res.statusText === "OK") {
      //   router.refresh();
      //   toast.success(res.data.message);
      // } else {
      //   setError(res.data.message);
      // }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            required
            id="email"
            type="email"
            name="email"
            disabled={isPending}
            value={formData.email}
            onChange={handleOnchange}
            placeholder="m@example.com"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <InputGroup>
            <InputGroupInput
              required
              id="password"
              name="password"
              autoComplete="off"
              disabled={isPending}
              onChange={handleOnchange}
              value={formData.password}
              placeholder="Enter password"
              type={isPassword ? "password" : "text"}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                disabled={isPending}
                variant="ghost"
                aria-label="Info"
                size="icon-xs"
                onClick={() => setIsPassword(!isPassword)}
              >
                {isPassword ? <EyeClosedIcon /> : <EyeIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : null}
            Login
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" disabled={isPending}>
            <Image
              src={"/svg/github.svg"}
              width={20}
              height={20}
              alt="github"
              className=""
            />
            Login with GitHub
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

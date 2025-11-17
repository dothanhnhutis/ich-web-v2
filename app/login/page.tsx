import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/logo";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="hidden lg:flex justify-center gap-2 lg:justify-start">
          <Link href="#">
            <Logo
              priority
              type="rectangle"
              width={200}
              height={60}
              className="aspect-[10/3] shrink-0"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Link
              href="#"
              className="flex lg:hidden items-center justify-center gap-2 font-medium px-3 py-1 mb-10"
            >
              <Logo
                priority
                type="rectangle"
                width={250}
                height={75}
                className="aspect-[10/3] shrink-0"
              />
            </Link>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          fill
          src="/images/landscape.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-right object-cover"
        />
      </div>
    </div>
  );
}

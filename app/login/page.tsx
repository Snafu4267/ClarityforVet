import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center px-6 text-sm text-stone-600">Loading sign-in…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

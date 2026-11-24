import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin sign in" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm rounded-[2rem] bg-soft p-8 md:p-10">
        <p className="font-display text-3xl font-bold tracking-[-0.05em]">SIAZ</p>
        <p className="mb-8 mt-1 text-sm text-muted">Studio administration</p>
        <LoginForm />
      </div>
    </main>
  );
}

"use server";

import { redirect } from "next/navigation";
import { checkPassword, endAdminSession, startAdminSession } from "@/lib/admin-auth";

export type FormState = { error?: string } | undefined;

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "Incorrect password." };
  await startAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await endAdminSession();
  redirect("/admin/login");
}

// Product and order mutations are intentionally disabled in database-free demo mode.
// The admin interface remains available for previewing the seeded catalogue.
export async function saveProductAction(_: FormState, _formData: FormData): Promise<FormState> {
  return { error: "Product editing is disabled in demo mode. Connect a database to save changes." };
}

export async function deleteProductAction(_formData: FormData) {
  redirect("/admin/products");
}

export async function toggleActiveAction(_formData: FormData) {
  redirect("/admin/products");
}

export async function updateOrderStatusAction(_formData: FormData) {
  redirect("/admin/orders");
}

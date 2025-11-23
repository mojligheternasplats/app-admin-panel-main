"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Simple fallback slug generator
 */
function generateSlug(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")  // remove special chars
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");     // replace spaces with hyphens
}

/**
 * Handle create/update mutation with FormData
 */
async function handleDataMutation(formData: FormData, model: string, token: string) {
  const id = formData.get("id") as string | null;

  if (!token) throw new Error("Token is required");

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${model}/${id}` : `${API_URL}/${model}`;

  // If slug is missing, auto-generate one
  const title = formData.get("title") as string | null;
  if (title && !formData.get("slug")) {
    formData.set("slug", generateSlug(title));
  }

  const res = await fetch(url, {
    method,
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`API ${method} ${model} error: ${res.status} - ${message}`);
  }

  return res.json();
}

export async function createOrUpdateAction(formData: FormData, token: string) {
  const model = formData.get("model") as string;
  if (!model) throw new Error("Model is required in formData");

  return handleDataMutation(formData, model, token);
}

/**
 * DELETE handler
 */
async function handleDelete(formData: FormData, model: string) {
  const id = formData.get("id") as string;
  const token = formData.get("token") as string | null;

  if (!id) throw new Error("ID is required for delete");

  const url = `${API_URL}/${model}/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`API DELETE ${model} error: ${res.status} - ${message}`);
  }

  const result = await res.json();

  revalidatePath(`/dashboard/${model}`);
  return result;
}

export async function deleteAction(formData: FormData) {
  const model = formData.get("model") as string;
  return handleDelete(formData, model);
}

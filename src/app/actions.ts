"use server";

import { revalidatePath } from "next/cache";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// 🔑 Slug generator

// 🔧 Create / Update
async function handleDataMutation(formData: FormData, model: string, token: string) {
  const id = formData.get("id") as string | null;

  if (!token) throw new Error("Token is required");

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${model}/${id}` : `${API_URL}/${model}`;

  const res = await fetch(url, {
    method,
    body: formData, // ✅ Send FormData directly
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Correct way to send token
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
// 🔧 Delete
async function handleDelete(formData: FormData, model: string) {
   
  const id = formData.get("id") as string;
  const token = formData.get("token") as string | null;
 console.log("token",token)

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

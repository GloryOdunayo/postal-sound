// lib/auth.ts
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function signup(username: string, email: string, password: string) {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Signup failed");
  }

  return res.json();
}

export async function signin(identifier: string, password: string) {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Signin failed");
  }

  return res.json(); // returns { jwt, user }
}

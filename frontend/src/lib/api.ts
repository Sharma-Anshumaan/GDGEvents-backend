import * as SecureStore from "expo-secure-store";

export const BASE_URL = "http://40.81.236.95/api";

let token: string | null = null;

export async function loadToken() {
  token = await SecureStore.getItemAsync("token");
  return token;
}

export async function saveToken(newToken: string) {
  token = newToken;
  await SecureStore.setItemAsync("token", newToken);
}

export async function clearToken() {
  token = null;
  await SecureStore.deleteItemAsync("token");
}

export async function api(path: string, method = "GET", body?: object) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const isAuthPath = path === "/login/" || path === "/register/";
  if (token && !isAuthPath) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(BASE_URL + path, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {}

  return { ok: response.ok, status: response.status, data: data };
}

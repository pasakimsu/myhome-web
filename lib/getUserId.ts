// lib/getUserId.ts

export const getUserId = (): string => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("userId") || "";
  };
  
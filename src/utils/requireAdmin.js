import { redirect } from "react-router-dom";

export const requireAdmin = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/admin/me`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw redirect("/login");
  }

  return null;
};

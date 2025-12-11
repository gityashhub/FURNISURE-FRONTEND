// utils/syncUser.ts

import api from "./api";
import { UserResource } from "@clerk/types";

export const syncUserToBackend = async (user: UserResource, token: string | null) => {
  if (!user || !token) return;

  const userData = {
    clerkId: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: user.fullName,
    phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || null,
  };
console.log(userData);
console.log("syncuser is called");

  try {
    await api.post("/auth/users/sync", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ User synced to backend");
  } catch (error) {
    console.error("❌ Failed to sync user:", error);
  }
};

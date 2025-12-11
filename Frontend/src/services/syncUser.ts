// This file is no longer needed as the app uses custom JWT auth instead of Clerk
// User data is synced during registration/login through the backend auth endpoints

export const syncUserToBackend = async () => {
  // No-op - user sync is handled by the backend auth endpoints
  console.log("User sync is handled by backend auth endpoints");
};

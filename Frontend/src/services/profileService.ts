import { authApiRequest } from './api';

// Fetch the current user's profile
export async function getProfile(getToken: () => Promise<string | null>) {
  const response = await authApiRequest('get', '/auth/profile', getToken);
  return response.data;
}

// Fetch the current user's orders
export async function getProfileOrders(getToken: () => Promise<string | null>) {
  const response = await authApiRequest('get', '/auth/profile/orders', getToken);
  return response.data;
}

// Cancel an order
export async function cancelOrder(orderId: string, getToken: () => Promise<string | null>) {
  const response = await authApiRequest('put', `/auth/profile/orders/${orderId}`, getToken, { status: 'cancelled' });
  return response.data;
}

// Update the current user's profile
export async function editProfile(
  getToken: () => Promise<string | null>,
  profileData: { email?: string; fullName?: string; phoneNumber?: string }
) {
  const response = await authApiRequest('put', '/auth/profile', getToken, profileData);
  return response.data;
}

import api from './api';

const getAuthToken = () => localStorage.getItem('authToken');

export async function getProfile() {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');
  
  const response = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function getProfileOrders() {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');
  
  const response = await api.get('/auth/profile/orders', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function cancelOrder(orderId: string) {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');
  
  const response = await api.put(`/auth/profile/orders/${orderId}`, 
    { status: 'cancelled' },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function editProfile(
  profileData: { email?: string; fullName?: string; phoneNumber?: string }
) {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');
  
  const response = await api.put('/auth/profile', profileData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

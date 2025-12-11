import { authApiRequest } from './api';

export async function fetchAllCustomers(getToken: () => Promise<string | null>) {
  const response = await authApiRequest('get', '/admin/customers', getToken);

  console.log('============data of customers========================');
  console.log(response.data);
  console.log('====================================');
  return response.data;
} 
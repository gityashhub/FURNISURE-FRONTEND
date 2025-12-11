import api from './api';

export const contactService = {
  sendContactMessage: async (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    // Replace '/contact' with your actual backend endpoint if different
    const response = await api.post('/contact', data);
    return response.data;
  },
}; 
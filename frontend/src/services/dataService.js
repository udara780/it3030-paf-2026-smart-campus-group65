import api from './api';

export const facilityService = {
  getAll: (params) => api.get('/facilities', { params }),
  getById: (id) => api.get(`/facilities/${id}`),
  create: (data) => api.post('/facilities', data),
  update: (id, data) => api.put(`/facilities/${id}`, data),
  delete: (id) => api.delete(`/facilities/${id}`),
};

export const bookingService = {
  getAll: (params) => api.get('/bookings', { params }),
  getMyBookings: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  approve: (id, data) => api.put(`/bookings/${id}/approve`, data),
  reject: (id, data) => api.put(`/bookings/${id}/reject`, data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

export const ticketService = {
  getAll: (params) => api.get('/tickets', { params }),
  getMyTickets: () => api.get('/tickets/my'),
  getAssignedTickets: () => api.get('/tickets/assigned'),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (formData) =>
    api.post('/tickets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  assignTechnician: (id, data) => api.put(`/tickets/${id}/assign`, data),
  updateStatus: (id, data) => api.put(`/tickets/${id}/status`, data),
  addComment: (id, data) => api.post(`/tickets/${id}/comments`, data),
};

export const notificationService = {
  getAll: () => api.get('/notifications'),
  getUnread: () => api.get('/notifications/unread'),
  getUnreadCount: () => api.get('/notifications/unread/count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const authService = {
  googleLogin: (token) => api.post('/auth/google', { token }),
  getCurrentUser: () => api.get('/auth/me'),
};

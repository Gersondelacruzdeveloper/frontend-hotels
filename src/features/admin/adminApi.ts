// src/features/admin/adminApi.ts
import api from "../../lib/api";

export const AdminApi = {
  departments: {
    list: (hotel: string) => api.get(`/hotels/departments/?hotel=${hotel}`),
    create: (hotel: string, body: any) => api.post(`/hotels/departments/?hotel=${hotel}`, body),
    update: (hotel: string, id: string, body: any) => api.put(`/hotels/departments/${id}/?hotel=${hotel}`, body),
    remove: (hotel: string, id: string) => api.delete(`/hotels/departments/${id}/?hotel=${hotel}`),
  },
  staff: {
    list: (hotel: string) => api.get(`/hotels/staff/?hotel=${hotel}`),
    create: (hotel: string, body: any) => api.post(`/hotels/staff/?hotel=${hotel}`, body),
    update: (hotel: string, id: string, body: any) => api.put(`/hotels/staff/${id}/?hotel=${hotel}`, body),
    remove: (hotel: string, id: string) => api.delete(`/hotels/staff/${id}/?hotel=${hotel}`),
  },
  quickReplies: {
    list: (hotel: string) => api.get(`/hotels/quick-replies/?hotel=${hotel}`),
    create: (hotel: string, body: any) => api.post(`/hotels/quick-replies/?hotel=${hotel}`, body),
    update: (hotel: string, id: string, body: any) => api.put(`/hotels/quick-replies/${id}/?hotel=${hotel}`, body),
    remove: (hotel: string, id: string) => api.delete(`/hotels/quick-replies/${id}/?hotel=${hotel}`),
  },
  qr: {
    list: (hotel: string) => api.get(`/hotels/qr-links/?hotel=${hotel}`),
    create: (hotel: string, body: any) => api.post(`/hotels/qr-links/?hotel=${hotel}`, body),
    remove: (hotel: string, id: string) => api.delete(`/hotels/qr-links/${id}/?hotel=${hotel}`),
  },
  settings: {
    list: (hotel: string) => api.get(`/hotels/settings/?hotel=${hotel}`),
    upsert: (hotel: string, key: string, value: any, id?: string) =>
      id
        ? api.put(`/hotels/settings/${id}/?hotel=${hotel}`, { key, value })
        : api.post(`/hotels/settings/?hotel=${hotel}`, { key, value }),
  },
};

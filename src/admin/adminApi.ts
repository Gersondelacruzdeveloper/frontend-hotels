// src/features/admin/adminApi.ts
import api from "../lib/api";

export const AdminApi = {
  hotels: {
    list: () => api.get("/hotels/hotels/"),
    create: (body: {
      organization: string;     // or omit if not required
      name: string;
      slug: string;
      brand_color?: string;
      logo?: string;            // URL
      primary_staff_language?: string; // e.g. "es"
      country?: string;         // ISO-2
      timezone?: string;
      is_active?: boolean;
    }) => api.post("/hotels/hotels/", body),
    update: (id: string, body: any) => api.put(`/hotels/hotels/${id}/`, body),
    patch:  (id: string, body: any) => api.patch(`/hotels/hotels/${id}/`, body),
    remove: (id: string) => api.delete(`/hotels/hotels/${id}/`),
  },

  // you already had these; keeping here for completeness
  departments: {
    list: (hotel: string) => api.get(`/hotels/departments/?hotel=${hotel}`),
    create: (hotel: string, body: any) => api.post(`/hotels/departments/?hotel=${hotel}`, body),
    update: (hotel: string, id: string, body: any) => api.put(`/hotels/departments/${id}/?hotel=${hotel}`, body),
    remove: (hotel: string, id: string) => api.delete(`/hotels/departments/${id}/?hotel=${hotel}`),
  },
  staff: {
    list: (hotel: string) => api.get(`/hotels/staff/?hotel=${hotel}`),
    create: (hotel: string, body: any) => api.post(`/hotels/staff/?hotel=${hotel}`, body), // {user, role, department?}
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
      id ? api.put(`/hotels/settings/${id}/?hotel=${hotel}`, { key, value })
         : api.post(`/hotels/settings/?hotel=${hotel}`, { key, value }),
  },
  conversations: {
    openCount: async (hotel: string) => {
      const { data } = await api.get(`/hotels/conversations/?hotel=${hotel}&status=open`);
      return Array.isArray(data) ? data.length : (data.results?.length || 0);
    },
  },
};

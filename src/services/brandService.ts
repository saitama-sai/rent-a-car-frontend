import api from './api';
import type { Brand } from '../types';

export const brandService = {
    getAll: async () => {
        const response = await api.get<Brand[]>('/brands');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Brand>(`/brands/${id}`);
        return response.data;
    },

    create: async (name: string) => {
        const response = await api.post<Brand>('/brands', { name });
        return response.data;
    },

    update: async (id: number, name: string) => {
        await api.put(`/brands/${id}`, { name });
    },

    delete: async (id: number) => {
        await api.delete(`/brands/${id}`);
    }
};

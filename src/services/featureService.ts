import api from './api';
import type { Feature } from '../types';

export const featureService = {
    getAll: async () => {
        const response = await api.get<Feature[]>('/features');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Feature>(`/features/${id}`);
        return response.data;
    },

    create: async (name: string) => {
        const response = await api.post<Feature>('/features', { name });
        return response.data;
    },

    update: async (id: number, name: string) => {
        await api.put(`/features/${id}`, { name });
    },

    delete: async (id: number) => {
        await api.delete(`/features/${id}`);
    }
};

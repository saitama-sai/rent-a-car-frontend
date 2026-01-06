import api from './api';
import type { Car } from '../types';

export const carService = {
    getAll: async () => {
        const response = await api.get<Car[]>('/cars');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Car>(`/cars/${id}`);
        return response.data;
    },

    create: async (car: Partial<Car>) => {
        const response = await api.post<Car>('/cars', car);
        return response.data;
    },

    update: async (id: number, car: Partial<Car>) => {
        const response = await api.put<Car>(`/cars/${id}`, car);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/cars/${id}`);
    }
};

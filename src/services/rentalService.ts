import api from './api';
import type { Rental } from '../types';

export const rentalService = {
    rent: async (userId: string, carId: number, startDate: string, endDate: string) => {
        const response = await api.post<Rental>('/rentals', {
            userId,
            carId,
            startDate,
            endDate
        });
        return response.data;
    },

    getAll: async () => {
        const response = await api.get<Rental[]>('/rentals');
        return response.data;
    },

    async update(id: number, data: any): Promise<void> {
        await api.put(`/rentals/${id}`, data);
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/rentals/${id}`);
    }
};

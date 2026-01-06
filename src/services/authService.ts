import api from './api';
import type { AuthResponse } from '../types';

export const authService = {
    login: async (credentials: { email: string; password: string }) => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: any) => {
        // Eğer userData içinde 'file' veya 'profilePicture' gibi bir alan varsa FormData kullan
        // Ancak formdan gelen veri yapısına göre özelleştirmemiz gerekebilir.
        // Basitlik adına, generic bir kontrol yapalım veya parametre olarak gelen veriyi kontrol edelim.

        // Eğer userData FormData ise direkt gönder
        if (userData instanceof FormData) {
            const response = await api.post<AuthResponse>('/auth/register', userData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        }

        const response = await api.post<AuthResponse>('/auth/register', userData);
        return response.data;
    },

    updateProfile: async (id: string, userData: any) => {
        const response = await api.put<any>(`/users/${id}`, userData);
        return response.data;
    },

    uploadProfilePicture: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<{ url: string }>(`/users/${id}/upload-profile-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};

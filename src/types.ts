export type Role = 'admin' | 'customer';

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName: string;
    profilePictureUrl?: string;
    role: 'admin' | 'customer';
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Brand {
    id: number;
    name: string;
}

export interface Feature {
    id: number;
    name: string;
}

export interface Car {
    id: number;
    brandId: number;
    brand?: Brand;
    model: string;
    year?: number;
    color?: string;
    plate: string;
    dailyPrice: number;
    imageUrl?: string;
    available: boolean;
    features?: Feature[];
}

export interface Rental {
    id: number;
    userId: string;
    user?: User;
    carId: number;
    car?: Car;
    startDate: string;
    endDate: string;
    totalPrice: number;
}

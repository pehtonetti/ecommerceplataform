export type UserRole = 'customer' | 'editor' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number; // Stored in cents
    currency: string;
    imageUrl: string;
    category: string;
    stock: number;
    active: boolean;
    createdAt: string;
    videoUrl?: string | null;
    images?: Array<{ url: string }>;
    colors?: any; // JSON
    capacities?: any; // JSON
}

export interface StoreConfig {
    storeName: string;
    primaryColor: string;
    logoUrl?: string;
    businessType: 'products' | 'services';
    paymentMethods: {
        pix: boolean;
        creditCard: boolean;
    }
}

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    totalAmount: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled';
    createdAt: string;
}

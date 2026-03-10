export interface DekkproCustomer {
    name: string;
    contact?: string;
    deliveryAddress?: string;
    info?: string;
}

export interface DekkproProduct {
    searchTerm: string;
    quantity?: number;
    season?: 'Alle' | 'Sommer' | 'M+S' | 'M+S Pigg';
    category?: 'Diverse' | 'Arbeid';
    sourceTab?: string;
}

export interface DekkproOrderData {
    customer: DekkproCustomer;
    product: DekkproProduct;
    printMode: 'preview' | 'auto' | 'none';
    submitAction: 'Tilbud' | 'Reservasjon' | 'Faktura' | 'Bankkort' | 'Lagre & Lukk';
}

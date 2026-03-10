import { DekkproOrderData } from "./OrderDataType";

export const TestCustomers = {
    defaultCustomer: 'Thao',
};

export const TestProducts = {
    searchTerm: 'GoodYear',
};

export const SeasonFilters = {
    alle: 'Alle' as const,
    sommer: 'Sommer' as const,
    ms: 'M+S' as const,
    msPigg: 'M+S Pigg' as const,
};

export const PrintModes = {
    preview: 'preview' as const,
    auto: 'auto' as const,
    none: 'none' as const,
};

export const defaultOrderData: DekkproOrderData = {
    customer: {
        name: TestCustomers.defaultCustomer,
    },
    product: {
        searchTerm: TestProducts.searchTerm,
        quantity: 1,
        season: SeasonFilters.alle,
    },
    printMode: PrintModes.none,
    submitAction: 'Reservasjon',
};

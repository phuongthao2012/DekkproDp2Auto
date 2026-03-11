// DP2-23193: Purchase Order List search by customer phone number
// Verify the phone number below matches the customer record in demo.dekkpro.no
export const poSearchByPhoneData = {
    customer: {
        name: '3M Autosport AS',
        phone: '23456789',
    },
};

export const alternativeAddressData = {
    customer: {
        primary: 'Bileko Car Parts Norway AS',
        customerNumber: '240612',
        alternativeDelivery: 'K 2000 Bilpleie Bergen avd Dekk & Felg',
    },
    expectedAddress: {
        street: 'Conrad Mohrsvei 25',
        postalCity: '5072 Bergen',
        mobile: '55206110',
    },
    product: {
        searchTerm: 'GoodYear',
    },
};

export const fullResSalePriceData = {
    customer: {
        name: '3M Autosport AS',
        discountGroup: 'Gruppe 3 - Forhandlere',
    },
    products: {
        primary: {
            articleNumber: 'ALL60010005',
            expectedDiscount: '50',
            expectedSalePriceExVat: '12 140',
        },
        secondary: {
            articleNumber: 'BIDSTA20A/24',
            expectedDiscount: '37',
            expectedSalePriceExVat: '15,75',
        },
    },
};

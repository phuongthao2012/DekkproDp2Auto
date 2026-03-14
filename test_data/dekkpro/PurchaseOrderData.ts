// DP2-23193: Purchase Order List search by customer vendor name
export const poSearchByVendorNameData = {
    customer: {
        name: '3M Autosport AS',
    },
};

// DP2-23193: Purchase Order List search by customer mobile phone / telephone
export const poSearchByPhoneData = {
    customer: {
        name: '3M Autosport AS',
    },
    poNumber: '99900',
    searchTerms: {
        fullMobile: '4784948',
        partialMobile: '84948',
        phone: '880404',
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

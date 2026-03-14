// WPR-0063: Submit API and check order

export const API_BASE_URL = 'https://demo.is.dekkpro.no';

export function buildOrderBody(wsid: string) {
    return {
        Order: {
            InventoryId: 'c34f1d65-366d-49bc-9561-e21fb836cf9b',
            CustomerId: 'b2d4da2f-cb45-4efa-8b27-f7af29c57c20',
            CustomerNumber: '121105',
            Notes: `from automation + API ${wsid} verify UI`,
            OrderFrom: 'B',
            RecvisitionNumber: `RecvisitionNumber${wsid}`,
            OrderType: 3,
            Source: `Source field${wsid}`,
            PurchaseComment: `PurchaseComment${wsid}`,
            PurchaseCondition: false,
            WebshopOrderId: wsid,
            RegistrationNumber: `63X1008-${wsid}`,
            FreeSmallOrderFee: false,
            PickupOrder: false,
        },
        OrderLines: [
            {
                ProductSkuId: '48a59b3f-0ee0-46eb-81fe-f31448565619',
                Units: 1,
                UnitPriceIncludingEnvironmentTax: true,
            },
            {
                ProductSkuId: 'bfd068b8-0856-487d-9d81-22827f5a3683',
                Units: 1,
            },
            {
                ProductSkuId: '8d978bff-8293-413d-9166-b6b94ea1772e',
                Units: 1,
            },
            {
                ProductSkuId: '8d978bff-8293-413d-9166-b6b94ea1772e',
                Units: 1,
            },
        ],
        OrderLineOtherProducts: [
            {
                OtherProductId: 'a3aef2a0-ed83-4f16-b7a2-bd87fc5de701',
                Units: 1,
                UnitPrice: 40,
            },
        ],
        ShippingAddress: {
            Address: 'Laastad & CoSpannavegen 142  5535 Haugesund',
            PostAddress: 'Spannavegen 142  5535 Haugesund',
            Phone: '909000630      ',
            Email: 'pt290904@yh.com  ',
            City: ' GJESÅSEN',
            ZipCode: '79000',
            Reference: 'thaonguyen2012Ref',
            ReceiverName: '02 SOLØR AS AUTOSERVICE   ',
        },
    };
}

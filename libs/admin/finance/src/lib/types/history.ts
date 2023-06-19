export type InvoiceHistoryResponse = {
    totalAmount: number;
    totalPaidAmount: number;
    totalDueAmount: number;
    invoiceCode: string;
    invoiceGenerated: boolean;
    invoiceDate: number;
    pdfUrl: string;
    bookingNumber: string;
}

export type TransactionHistoryResponse = {
    id: string;
    amount: number;
    transactionId: string;
    status: string;
    reservationId: string;
    created: number;
    paymentMethod: string;
    remarks: string;    
}

// {
//     "total": 299,
//     "entityTypeCounts": {},
//     "entityStateCounts": {
//         "SUCCESS": 242,
//         "FAILURE": 11
//     },
//     "records": [
//         {
//             "id": "232f5aca-872d-4193-aec3-179ac1d3b286",
//             "amount": 123.0,
//             "transactionId": null,
//             "status": "SUCCESS",
//             "reservationId": "e68409f0-5735-46a5-b888-8d3dbd8c47a3",
//             "created": 1681822872842,
//             "paymentMethod": null,
//             "remarks": "123"
//         },
//         {
//             "id": "a3e9a307-8bc9-4d56-bba7-ae8da95fdeb5",
//             "amount": 0.0,
//             "transactionId": null,
//             "status": "SUCCESS",
//             "reservationId": null,
//             "created": 1681722516967,
//             "paymentMethod": null,
//             "remarks": null
//         }
//     ]
// }
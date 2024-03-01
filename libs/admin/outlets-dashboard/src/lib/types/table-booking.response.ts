interface Area {
  id: string;
  name: string;
  status: boolean;
  shortDescription: string;
}

interface MenuItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  popular: boolean;
  mealPreference: string;
  category: string;
  preparationTime: number;
  quantity: number;
  unit: string;
  dineInPrice: number;
  deliveryPrice: number;
  hsnCode: string;
  entityId: string;
  status: boolean;
  itemCode: string;
  parentId: string;
}

export type TableReservationResponse = {
  id: string;
  number: string;
  created: number;
  updated: number;
  reservationId: string;
  pax: number;
  area: Area;
  entityId: string;
  inventoryType: string;
  frontOfficeState: string;
  booking: {
    id: string;
    from: string;
    to: number;
    entityId: string;
    occupancyDetails: {
      maxChildren: number;
      maxAdult: number;
    };
    source: string;
    sourceName: string;
    marketSegment: string;
    reservationNumber: string;
    status: string;
    guest: {
      id: string;
      firstName: string;
      lastName: string;
      contactDetails: {
        cc: string;
        contactNumber: string;
        emailId: string;
      };
      dateOfBirth: number;
      age: number;
      type: string;
      isVerified: boolean;
      status: boolean;
      code: string;
      created: number;
      updated: number;
      gender: string;
      creditLimit: number;
      creditLimitUsed: number;
    };
    tableNumberOrRoomNumber: string;
    created: number;
    updated: number;
    nextStates: string[];
    items: [];
    outletType: string;
    currentJourney: string;
    currentJoureyStatus: string;
    currentJourneyState: string;
    systemAction: boolean;
    totalReservationAmount: number;
    printRate: boolean;
    order: {
      id: string;
      number: string;
      status: string;
      type: string;
      reservationId: string;
      items: {
        id: string;
        amount: number;
        description: string;
        remarks: string;
        transactionType: string;
        unit: number;
        type: string;
        currency: string;
        itemId: string;
        kotId: string;
        menuItem: MenuItem;
        created: number;
      }[];
      entityId: string;
      createdBy: string;
      pricingDetails: {
        totalAmount: number;
        taxAmount: number;
        totalDiscount: number;
        paidAmount: number;
        dueAmount: number;
        payableAmount: number;
        printRate: boolean;
        packages: any[]; // Define appropriate type if known
        paymentAmount: number;
        totalCgstTax: number;
        totalSgstTax: number;
        totalAddOnsAmount: number;
        totalRoomCharge: number;
        totalRoomDiscount: number;
        totalAddOnsTax: number;
        totalAddOnsDiscount: number;
        totalAllowance: number;
        containerCharge: number;
      };
      kots: {
        id: string;
        number: string;
        status: string;
        instructions: string;
        items: {
          id: string;
          amount: number;
          description: string;
          remarks: string;
          transactionType: string;
          unit: number;
          type: string;
          currency: string;
          itemId: string;
          kotId: string;
          menuItem: MenuItem;
          created: number;
        }[];
        created: number;
      }[];
      source: string;
      created: number;
      containerCharge: number;
    };
    tableIdOrRoomId: string;
    areaId: string;
    externalBooking: boolean;
  };
};

export type TableReservationListResponse = {
  total: number;
  entityTypeCounts: { [key: string]: number };
  entityStateCounts: { [key: string]: number };
  tables: TableReservationResponse[];
};

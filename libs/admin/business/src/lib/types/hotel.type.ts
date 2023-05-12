export type HotelFormData = {
    hotel: {
        name: string;
        serviceNames: string;
        description: string[];
        address: string;
        contact: string;
        email: string;
        segment: string;
        imageUrls: string[];
        active: boolean;
        complimentaryAmenities: string[];
        socialPlatForms: string[];
    } 
    brandId: string;

};

export type HotelConfiguration = {
  id: string;
  name: string;
  logo: string;
  configuration: {
    id: string;
    kidsAge: number;
    ocrActive: boolean;
    pmsActive: boolean;
    signaturePositionX: number;
    signaturePositionY: number;
    synEnddays: number;
    syncStartDays: number;
    smtpPort: number;
    smtpTtlsEnables: boolean;
    faceRecognitionActive: boolean;
    ocrNameValidatioPercentage: number;
    syncPollPeriod: number;
    externalFeedbackRedirect: boolean;
    totalRooms: number;
    sharerDocumentsRequired: boolean;
    accompanyDocumentsRequired: boolean;
    kidsDocumentsRequired: boolean;
    reminderPeriod: number;
    checkoutMailEnable: boolean;
  };
  complimentaryAmenities;
  description: string;
  contact;
  email;
  imageUrls: string[];
  segment: string;
  socialPlatForms: SocialPlatForms[];
  brand: {
    id: string;
    name: string;
    logo: string;
    description: string;
    address: {
      id: string;
      latitude: number;
      longitude: number;
      pincode: number;
    };
    socialPlatforms: SocialPlatForms[];
    status: boolean;
  };
  address: {
    id: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    pincode: number;
  };
  serviceName: string;
  timezone: string;
  redirectionParameter: object;
  socialPlatforms: object[];
  feedbackRedirect: boolean;
  cmsServicesLastUpdated: number;
  showAddress: boolean;
  status: boolean;
  source: string;
  parentId: string;
};

export type SocialPlatForms = {
  id: string;
  name: string;
  imageUrl: string;
  redirectUrl: string;
};

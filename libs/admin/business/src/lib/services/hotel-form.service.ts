export class HotelFormDataServcie {
  //save hotelinfo  data locally
  hotelInfoFormData: importForm = {
    address: {
      value: '',
    },
    imageUrl: [],
    serviceIds: [] = [],
    services: [] = [],
    allServices: [],
  };
  hotelFormState: boolean = false;

  initHotelInfoFormData(input: any, hotelFormState: boolean) {
    this.hotelInfoFormData = { ...this.hotelInfoFormData, ...input };
    this.hotelFormState = hotelFormState;
  }

  resetHotelInfoFormData() {
    this.hotelInfoFormData = {
      address: {
        value: '',
      },
      imageUrl: [],
      serviceIds: [] = [],
      services: [] = [],
      allServices: [],
    };
    this.hotelFormState = false;
  }
}
export type importForm = {
  imageUrl;
  address;
  services: any[];
  serviceIds: any[];
  allServices: any[];
} & Record<string, any>;

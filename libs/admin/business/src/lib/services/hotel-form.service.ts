export class HotelFormDataServcie {
  hotelFormData = {};
  private inActiveServiceList = [];
  private activeServiceList = [];
  private activeServiceIds = [];
  isReturnFromService = false;

  setInActiveServiceList(serviceList) {
    this.inActiveServiceList = serviceList;
  }

  setActiveServiceIds(serviceIds) {
    serviceIds.forEach((serviceId) => {
      if (!this.activeServiceIds.includes(serviceId))
        this.activeServiceIds.push(serviceId);
    });
  }

  getActiveServiceIds() {
    return this.activeServiceIds;
  }

  updateActiveServiceIds(serviceIds) {
    this.activeServiceIds.push(...serviceIds);
  }

  setActiveServiceList(serviceList) {
    this.activeServiceList = serviceList;
  }

  getInActiveServiceList() {
    return this.inActiveServiceList;
  }
  getactiveServiceList() {
    return this.activeServiceList;
  }

  updateInactiveserviceList(serviceList) {
    this.inActiveServiceList.push(...serviceList);
  }

  resetData() {
    this.activeServiceIds = [];
    this.inActiveServiceList = [];
    this.activeServiceList = [];
    this.isReturnFromService = false;
  }

  //save hotelinfo  data locally
  hotelInfoFormData: importForm = {
    address: {
      value: '',
    },
    imageUrl: [],
    serviceIds: [] = [],
    services: [] = [],
  };
  hotelFormState: boolean = false;

  initHotelInfoFormData(input: any, hotelFormState: boolean) {
    this.hotelInfoFormData = { ...this.hotelInfoFormData, ...input };
    this.hotelFormState = hotelFormState;
  }
}
export type importForm = {
  imageUrl;
  address;
  services: any[];
  serviceIds: any[];
} & Record<string, any>;

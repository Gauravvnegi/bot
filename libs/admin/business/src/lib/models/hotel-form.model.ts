export class ServcieStatusList {
  activeServiceList: any[] = [];
  inActiveServiceList: any[] = [];

  deserialize(service, activeServiceIds) {
    this.inActiveServiceList = service.filter(
      (service) => !activeServiceIds.includes(service.id)
    );
    return this;
  }
}

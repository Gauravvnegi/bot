export class SubscriptionPlan {
  featureIncludes: Item[];
  deserialize(input) {
    this.featureIncludes = new Array<Item>();
    input.featuresIncludes.forEach((data) => {
      this.featureIncludes.push(data);
    });
  }
}

export class Item {
  featureName: string;
  id: number;
  isManage: boolean;
  isView: boolean;
}

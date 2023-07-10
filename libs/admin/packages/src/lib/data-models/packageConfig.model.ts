import { get, set } from 'lodash';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class PackageDetail implements IDeserializable {
  amenityPackage: Package;
  deserialize(input: any) {
    this.amenityPackage = new Package().deserialize(input);
    return this;
  }
}

export class Packages implements IDeserializable {
  records: Package[];
  deserialize(input: any) {
    this.records = input.records.map((record) =>
      new Package().deserialize(record)
    );
    return this;
  }
}

export class Package implements IDeserializable {
  id: string;
  status: boolean;
  description: string;
  name: string;
  currency: string;
  entityId: string;
  packageCode: string;
  imageUrl: string;
  rate: number;
  packageSource: string;
  unit: string;
  quantity: number;
  type: string;
  autoAccept: boolean;
  categoryName: string;
  category: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'status', get(input, ['active'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'currency', get(input, ['currency'])),
      set({}, 'packageCode', get(input, ['packageCode'])),
      set({}, 'imageUrl', get(input, ['imageUrl'])),
      set({}, 'rate', get(input, ['rate'])),
      set({}, 'quantity', get(input, ['quantity'])),
      set({}, 'packageSource', get(input, ['source'])),
      set({}, 'unit', get(input, ['unit'])),
      set({}, 'autoAccept', get(input, ['autoAccept'])),
      set({}, 'categoryName', get(input, ['categoryName']) || ''),
      set({}, 'category', get(input, ['parentId']) || ''),
      set({}, 'type', get(input, ['rate']) === 0 ? 'Complimentary' : 'Paid')
    );
    return this;
  }
}

export class Amenity {
  id: string;
  parentId: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  startDate: number;
  endDate: number;
  active: boolean;
  currency: string;
  packageCode: string;
  imageUrl: string;
  entityId: string;
  source: string;
  type: string;
  unit: string;
  downloadUrl: string;
  autoAccept: boolean;
}

export enum PackageSource {
  Botshot = 'BOTSHOT',
  Pms = 'PMS',
}

export interface IpackageOptions {
  key?: string;
  label?: string;
  value: string;
}

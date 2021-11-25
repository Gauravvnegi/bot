import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class CategoryDetail implements Deserializable {
  category: Category;
  deserialize(input: any) {
    this.category = new Category().deserialize(input);
    return this;
  }
}

export class Categories implements Deserializable {
  records: Category[];
  deserialize(input: any) {
    this.records = input.records.map((record) =>
      new Category().deserialize(record)
    );
    return this;
  }
}

export class Category implements Deserializable {
  id: string;
  description: string;
  name: string;
  hotelId: string;
  imageUrl: string;
  active: boolean;
  subPackageNameList = '';
  subpackages: IPackage[];
  packageCode: string;

  deserialize(input: any) {
    input.subPackages &&
      input.subPackages.forEach((subPackage) => {
        this.subPackageNameList = this.subPackageNameList.concat(
          subPackage.name,
          ','
        );
      });
    this.subPackageNameList = this.subPackageNameList.substring(
      0,
      this.subPackageNameList.length - 1
    );
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'hotelId', get(input, ['hotelId'])),
      set({}, 'imageUrl', get(input, ['imageUrl'])),
      set({}, 'active', get(input, ['active']) || true),
      set({}, 'subpackages', get(input, ['subPackages'])),
      set({}, 'packageCode', get(input, ['packageCode'])),
      set({}, 'subPackageNameList', this.subPackageNameList || 'NA')
    );
    return this;
  }
}

export interface IPackage {
  id: string;
  name: string;
  imageUrl: string;
  packageCode: string;
}

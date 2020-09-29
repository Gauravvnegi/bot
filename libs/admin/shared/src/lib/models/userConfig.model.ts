import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class UserConfig implements Deserializable {
  permissionConfigs;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'permissionConfigs', get(input, ['permissions']))
    );

    return this;
  }
}

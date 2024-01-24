import { RATE_CONFIG_TYPE } from '../constants/rates.const';

export interface ConfigResponse {
  entityId: string;
  type: RATE_CONFIG_TYPE;
}

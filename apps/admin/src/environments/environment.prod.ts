import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  name: 'prod',
  production: true,
};

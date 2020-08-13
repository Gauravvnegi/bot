import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: false,
  baseUrl: 'https://api.botshot.in:8443',
};

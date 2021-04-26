import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  name: 'dev',
  base_url: 'https://devapi.botshot.in:8443',
};

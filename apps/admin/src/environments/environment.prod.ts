import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  name: 'prod',
  production: true,
  base_url: 'https://api.botshot.in:8443',
};

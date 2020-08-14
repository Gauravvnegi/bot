import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: false,
  base_url: 'https://api.botshot.in:8443',
};

import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: false,
  name: 'dev',
  base_url: 'https://api.botshot.in:8443',
};

import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  name: 'dev',
  base_url: 'https://api.botshot.in:8443',
};

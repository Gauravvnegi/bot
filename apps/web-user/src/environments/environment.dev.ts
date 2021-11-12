import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  base_url: 'https://testapi.botshot.in:32313',
};

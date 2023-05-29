import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  base_url: 'https://dev.api.botshot.ai:8443',
  host_url: 'https://dev.botshot.ai'
};

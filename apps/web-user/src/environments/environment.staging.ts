import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  name: 'staging',
  baseUrl: 'https://stageapi.botshot.in:8443',
};

import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  name: 'staging',
  base_url: 'https://stg.api.botshot.ai:31956',
  host_url: 'https://stg.web.botshot.ai'
};

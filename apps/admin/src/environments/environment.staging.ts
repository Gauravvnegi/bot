import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  name: 'staging',
  base_url: 'https://stageapi.botshot.in:8443',
  createWithUrl: 'https://createwith.botshot.ai',
};

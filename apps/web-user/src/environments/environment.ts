// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: false,
  name: 'default',
  // name: 'dev',
  base_url: 'https://stg.api.botshot.ai:31956',
  // base_url: 'https://dev.api.botshot.ai:8443',
  // base_url: 'https://api.botshot.in:8443',
  // host_url: 'localhost:4200',
  host_url: 'https://dev.botshot.ai'
  // host_url: 'https://stg.web.botshot.ai'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

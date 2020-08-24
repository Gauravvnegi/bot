import { Provider, Injectable } from '@angular/core';
export class LibToConfigureConfiguration {
  name: string;
}

@Injectable({ providedIn: 'root' })
export abstract class LibConfigurationProvider {
  abstract get config(): LibToConfigureConfiguration;
}

@Injectable({ providedIn: 'root' })
export class DefaultLibConfiguration extends LibConfigurationProvider {
  get config(): LibToConfigureConfiguration {
    // return default config
    return { name: `Fallback` };
  }
}

export class ThemeConfig {
  config?: Provider;
}

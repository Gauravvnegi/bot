import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

/**
 * @function getTranslationConfigs Configure translations.
 * @param deps Performs HTTP requests.
 * @param moduleName List of module names.
 * @returns An instance of the loader currently used (static loader by default).
 */
export const getTranslationConfigs = (
  deps: any[],
  moduleName: string[]
): any => {
  /**
   * @function HttpLoaderFactory Loads translations.
   * @param http Performs HTTP requests.
   * @returns Load translations.
   */
  function HttpLoaderFactory(http: HttpClient) {
    let translationFile = moduleName.map((name) => {
      return { prefix: `./assets/i18n/${name}/`, suffix: '.json' };
    });
    return new MultiTranslateHttpLoader(http, translationFile);
  }

  return {
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [...deps],
    },
    defaultLanguage: 'en-us',
    isolate: true,
  };
};

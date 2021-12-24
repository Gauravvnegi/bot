import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

/**
 * @var translationFile Store translation path.
 */
let translationFile: any[] = [];

/**
 * @function mapTranslationFiles Maps translation files.
 * @param moduleName List of module names.
 * @returns List of translation file or files.
 */
function mapTranslationFiles(moduleName: string[]) {
  translationFile = moduleName.map((name) => {
    return { prefix: `./assets/i18n/${name}/`, suffix: '.json' };
  });
}

/**
 * @function HttpLoaderFactory Loads translations.
 * @param http Performs HTTP requests.
 * @returns Load translations.
 */
function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, translationFile);
}

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
  debugger;
  mapTranslationFiles(moduleName);

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

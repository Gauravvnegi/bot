import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {
      prefix: `./assets/i18n/auth/`,
      suffix: '.json',
    },
    { prefix: './assets/i18n/core/', suffix: '.json' },
  ]);
}

const getTranslationConfigs = (deps) => {
  return {
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [...deps],
    },
  };
};

export default getTranslationConfigs;

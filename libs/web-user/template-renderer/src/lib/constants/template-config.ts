import { TemplateCode } from 'libs/web-user/shared/src/lib/constants/template';
import { Template } from 'libs/web-user/shared/src/lib/types/template';

export const templateConfig: Template = {
  [TemplateCode.temp000001]: {
    module: 'Temp000001Module',
    component: 'Temp000001Component',
    modulePath: async () =>
      import('../../../../templates/temp000001/src/lib/temp000001.module'),
    componentPath: async () =>
      import(
        '../../../../templates/temp000001/src/lib/containers/temp000001/temp000001.component'
      ),
  },
  [TemplateCode.tempCovid000001]: {
    module: 'TempCovid000001Module',
    component: 'TempCovid000001Component',
    modulePath: async () =>
      import(
        '../../../../templates/temp-covid000001/src/lib/temp-covid000001.module'
      ),
    componentPath: async () =>
      import(
        '../../../../templates/temp-covid000001/src/lib/containers/temp-covid000001/temp-covid000001.component'
      ),
  },
};

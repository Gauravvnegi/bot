import { ProductNames } from '@hospitality-bot/admin/shared';
import { ReportsConfig } from '../types/reports.types';
import {
  ReportConfigResponse,
  ReportMenu,
} from 'apps/admin/src/app/core/theme/src/lib/type/report-type';

export class ReportConfig {
  reportConfig: ProductReportConfig;

  deserialize(value: ReportConfigResponse) {
    const mapper = new Map<keyof typeof ProductNames, ReportsConfig>();

    Object.entries(value).forEach(([key, reports]) => {
      reports?.menu?.forEach((menuConfig: ReportMenu) => {
        menuConfig?.product.forEach((product) => {
          const reportsConfig = mapper.get(product);

          if (reportsConfig) {
            reportsConfig[key]
              ? reportsConfig[key]?.menu?.push(menuConfig)
              : (reportsConfig[key] = { menu: [menuConfig] });
          } else {
            mapper.set(product, { [key]: { menu: [menuConfig] } });
          }
        });
      });
    });

    this.reportConfig = Array.from(mapper.entries()).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {} as Record<keyof typeof ProductNames, ReportsConfig>
    );

    return this;
  }
}
export type ProductReportConfig = Record<
  keyof typeof ProductNames,
  ReportsConfig
>;

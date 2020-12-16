import { TemplateCode } from '../constants/template';

export type Template = {
  [key in TemplateCode]: ITemplateConfig;
};

export interface ITemplateConfig {
  module: string;
  component: string;
  modulePath: () => Promise<any>;
  componentPath: () => Promise<any>;
}

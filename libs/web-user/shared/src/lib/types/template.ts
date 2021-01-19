import { TemplateCode } from '../constants/template';
import { ITemplateTemp000001 } from './temp000001';
import { ITemplateTemp000002 } from './temp000002';
import { ITokenInfo } from './token';

export type TemplateCodes = keyof typeof TemplateCode;

export type Template = {
  [key in TemplateCode]: ITemplatePathConfig;
};

export interface ITemplatePathConfig {
  module: string;
  component: string;
  modulePath: () => Promise<any>;
  componentPath: () => Promise<any>;
}

export interface ITemplateConfig extends Omit<ITokenInfo, 'expiry'> {}

export interface ITemplatesData {
  [TemplateCode.temp000001]?: ITemplateTemp000001;
  [TemplateCode.tempCovid000001]?: any;
  [TemplateCode.temp000002]?: ITemplateTemp000002;
}

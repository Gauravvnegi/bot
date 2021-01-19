import { ITemplateTemp000001, ComponentWrappersTemp000001 } from './temp000001';

export interface ITemplateTemp000002 extends ITemplateTemp000001 {}

export type ComponentWrappersTemp000002 = string & ComponentWrappersTemp000001;

export type IComponentWrapperMapTemp000002 = {
  [key in ComponentWrappersTemp000002]: any;
};

export interface ITemplateTemp000001 {
  component: string;
  isLinear: boolean;
  journey: string;
  labelPosition: string;
  layout_variables: any;
  position: string;
  stepConfigs: IStepConfig[];
  template_id: string;
}

export interface IStepConfig {
  stepperName: string;
  required: boolean;
  layout?: any;
  events?: [];
  editable: boolean;
  component: {
    name: string;
  };
  buttons: IButton[];
}

export interface IButton {
  buttonClass: string;
  name: string;
  click: {
    fn_name: string;
  };
  settings: {
    isClickedTemplateSwitch: boolean;
    label: string;
    loaderLabel?: string;
    disableButtonIfLoading?: boolean;
  };
}

export type ComponentWrappersTemp000001 =
  | 'stay-details-wrapper'
  | 'guest-details-wrapper'
  | 'health-declaration-wrapper'
  | 'payment-details-wrapper'
  | 'document-details-wrapper'
  | 'bill-summary-details-wrapper'
  | 'summary-wrapper';

export type IComponentWrapperMapTemp000001 = {
  [key in ComponentWrappersTemp000001]: any;
};

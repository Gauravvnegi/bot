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
  settings: {
    label: string;
    loaderLabel?: string;
    isClickedTemplateSwitch: boolean;
    disableButtonIfLoading?: boolean;
    name: 'back';
    buttonClass: string;
    click: {
      fn_name: string;
    };
  };
}

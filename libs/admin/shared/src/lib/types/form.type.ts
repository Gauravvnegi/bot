import { AbstractControl, FormGroup } from '@angular/forms';

export type InputVariant = 'standard' | 'outlined';
export type Alignment = 'vertical' | 'horizontal';
export type InputType = 'number' | 'text';

export type Option<T = string, TOption = Record<string, any>> = {
  label: string;
  value: T;
  inactive?: boolean;
  icon?: string;
  extras?: string;
} & TOption;

export type FormProps = {
  fontSize?: string;
  float?: boolean;
  variant?: InputVariant;
  alignment?: Alignment;
  showClear?: boolean;
  placeholder?: string;
  errorMessages?: Record<string, string>;
  type?: InputType;
  isAsync?: boolean;
  dropdownIcon?: string;
  additionalInfo?: string;
  inputPrompt?: string;
  createPrompt?: string;
  subtitle?: string;
  isAutoFocusFilter?: boolean;
  tabIndex?: string;
  isPriceField?: boolean;
};

export type ButtonVariant = 'text' | 'contained' | 'outlined';

export type CategoryFormValue = {
  name: string;
  active: boolean;
  description: string;
  imageUrl: string;
};

export type AddressData = {
  placeId?: string;
  formattedAddress?: string;
  buildingName?: string;
  floor?: string;
  sector?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
};

export type FormGroupControls<TFormData> = FormGroup & {
  controls: Record<keyof TFormData, AbstractControl>;
  value: TFormData;
};

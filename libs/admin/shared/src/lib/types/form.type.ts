export type InputVariant = 'standard' | 'outlined';
export type Alignment = 'vertical' | 'horizontal';
export type InputType = 'number' | 'text';

export type Option = {
  label: string;
  value: string;
  inactive?: boolean;
} & Record<string, any>;

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
  addNewPrompt?: string;
};

export type ButtonVariant = 'text' | 'contained' | 'outlined';

export type CategoryFormValue = {
  name: string;
  active: boolean;
  description: string;
  imageUrl: string;
};
